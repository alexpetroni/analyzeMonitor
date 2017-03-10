<?php
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

//include_once 'class-sincron-form-handler.php';

/**
 * Manage scripts loading for frontend
 * 
 * @author alex
 *
 */
class Analyzes_Monitor_Ajax{
	
	
	public static function init(){
		$actionsArr = array(
				
				// analyze posts
				'fetch_analyzes',
				'get_analyze',
				'add_analyze',
				'update_analyze',
				'delete_analyze',
				
				// substance terms
				'fetch_substance_terms',
				'add_substance_term',
				'update_substance_term',
				'delete_substance_term',
				
				'update_substance_limits',
				
				// material terms
				'fetch_material_terms',
				'add_material_term',
				'update_material_term',
				'delete_material_term',
				
				// measure unit terms
				'fetch_measure_unit_terms',
				'add_measure_unit_term',
				'update_measure_unit_term',
				'delete_measure_unit_term',
				
				'do_logout'
				
		);
		
		foreach($actionsArr as $action){
			add_action('wp_ajax_'.$action, array(__CLASS__, $action));
		}		
	}
	
	
	
	public static function get_error_msg($msg){
		$error = array("status" => 'error', "msg" => $msg);
		echo json_encode( (object) $error) ;
		wp_die();
	}
	
	
	/**
	 * Get an error message if term is used 
	 * 
	 * used on delete terms operations, preventing deletion of non-empty terms
	 * 
	 * @param unknown $term_id
	 * @param unknown $taxonomy
	 * @return number|boolean
	 */
	public static function prevent_delete_non_empty_term($term_id, $taxonomy){
		$term = get_term_by( 'id', $term_id, $taxonomy);
		if($term){
			$count = (int)$term->count;
			$text = sprintf( _n( '%s element are referinta', '%s elemente au referinte', $count, 'ap_am' ), $count );
			self::get_error_msg("Acest element nu poate fi sters, $text spre el.");
		}
	}
	

// ===========================================================
//				Analyze CRUD
// ===========================================================

	
	/**
	 * Return a analyzes array with 'analyze' objects type:
	 * {
	 *  title: string, // day in format YYYY-MM-DD
	 *  id: int, // the post_ID, -1 if post does not exists
	 *  substances: [ // array of substances values
	 *  {  
	 *  	substance_id: int // substance taxonomy term id
	 *  	hour: string , 
	 *  	user_id: int, // the user id that added/updated substance
	 *  	comment: string,
	 *  	values: [   
	 *  			{
	 *  				mat_id: int  // the material taxonomy term id
	 *  				val: number // the registered value for that material,
	 *  				mat_description: string // the comment with lot, expired date etc for that material
	 *  				mu_id: int // the measure unit taxonomy term it 
	 *  			}, ...    
	 *  			]
	 *  }, ...],
	 */
	public static function fetch_analyzes(){
		
		if(!isset($_POST['data'])){
			self::get_error_msg( "Invalid query fetch_analyzes");
		}
		
		$analyzes_arr = array();
		
		foreach ($_POST['data'] as $title){
			$analyzes_arr[] = self::get_analyze_by_title($title);
		}
		
		echo json_encode((object)array('status'=>'ok', 'result' => $analyzes_arr));
		wp_die();
	}
	
	
	public static function get_analyze_by_title($title){
	
		$result = array('title' => $title );
		
		$page = get_page_by_title( $title, OBJECT, 'analyze' );
		
		if($page){			
			$result['id'] = $page->ID;
			$meta_arr = get_post_meta( $page->ID, 'substances');	
			$result['substances'] = isset($meta_arr[0]) ? $meta_arr[0] : array();
		}else{
			$result['id'] = -1;
			$result['substances'] = array();
		}
	
		return (object)$result;
	}
	
	
	public static function get_analyze(){
		if(!isset($_POST['data'])){
			self::get_error_msg( "Invalid query get_analyze");
		}
		
		$page_title = $_POST['data'];

		echo json_encode((object)array('status'=>'ok', 'result'=>self::get_analyze_by_title($page_title)));
		wp_die();
	}
	
	public static function add_analyze(){

	}
	
	public static function update_analyze(){
		if(!isset($_POST['data'])){
			self::get_error_msg( "Invalid query");
		}
		
		
		$data = $_POST['data'];
		$page_title = $data['title'];
		
		$page = get_page_by_title( $page_title, OBJECT, 'analyze' );	
		
		if($page){ // if page exist
			$post_id = $page->ID;
		}else{ // if it is new
			$page_args = array(
					'post_type'	=> 'analyze',
					'post_content'	=> '',
					'post_title'	=>  $data['title'],
					'post_status'	=> 'publish',
					'comment_status'	=> 'closed',
					
			);
			
			$post_id = wp_insert_post($page_args);
			
			if(is_wp_error($post_id)){
				self::get_error_msg( "Error creating anaylize");
			}
		}
		
		update_post_meta($post_id, 'substances', $data['substances']);
		
		// collect terms_id 
		$taxonomies = array();
		// substance term 
		foreach($data['substances'] as $substance){
			$taxonomies['substance'][] = (int)$substance['substance_id'];
			
			foreach ($substance['values'] as $value){
				$taxonomies['material'][] = (int)$value['mat_id'];
				$taxonomies['measure_unit'][] = (int)$value['mu_id'];
			}
		}
		
		
		// eliminate duplicates
		foreach ($taxonomies as $k => $val){
			$taxonomies[$k] = array_unique($val);
		}
		
		// append taxonomies to post
		foreach ($taxonomies as $k => $val){
			wp_set_object_terms( $post_id, $val, $k);
		}

		echo json_encode((object)array('status'=>'ok', 'result'=>self::get_analyze_by_title($page_title)));
		wp_die();
		
	}
	
	public static function delete_analyze(){

	}
	
	

	
// ===========================================================
//				Substance Term CRUD
// ===========================================================


	/**
	 * Return a substances array with substance objects type: 
	 * {term_id: int, 
	 *  slug: string,
	 *  name: string,
	 *  decimals: int,
	 *  measure_unit: int, // term_id from 'measure_unit' taxonomy
	 *  materials: [1..3] // array of term_id from 'material' taxonomy
	 */
	public static function fetch_substance_terms(){
		$terms_and_metas = array();
		
		$terms = get_terms( array(
				'taxonomy' => 'substance',
				'hide_empty' => false,
		));
		
		
		if(is_wp_error($terms)){
			self::get_error_msg('An error occured fetch_substance_terms');
		}
		
		
		$meta_keys = self::get_substance_meta_keys();
		
		// because WP_Term is received, transform it into array, add metas and back to object
		foreach ($terms as $term){
			
			$term_as_arr['term_id'] = $term->term_id;
			$term_as_arr['slug'] = $term->slug;
			$term_as_arr['name'] = $term->name;
			
			foreach($meta_keys as $k){
			$r = get_term_meta( $term->term_id, $k);
				$term_as_arr[$k] = $r[0];
			}
			$terms_and_metas[] = (object) $term_as_arr;
		}
		
		echo json_encode((object)array('status'=>'ok', 'result' => $terms_and_metas));
		wp_die();
	}
	
	
	public static function fetch_substance_by_term_id($term_id){
		
		$term = get_term_by( 'id', $term_id, 'substance');
		
		if(!$term) return null;
		
		
		$term_as_arr = array();
		$term_as_arr['term_id'] = $term->term_id;
		$term_as_arr['slug'] = $term->slug;
		$term_as_arr['name'] = $term->name;
		
		$meta_keys = self::get_substance_meta_keys();
		
		// because WP_Term is received, transform it into array, add metas and back to object				
		foreach($meta_keys as $k){
			$r = get_term_meta( $term->term_id, $k);
			$term_as_arr[$k] = $r[0];
		}
		
		
		$term_obj = (object) $term_as_arr;
		
		echo  json_encode((object)array('status'=>'ok', 'result' => $term_obj));
		wp_die();
	}
	
	
	public static function get_substance_meta_keys(){
		return array(
			'materials',
			'decimals',
			'measure_unit'
		);
	}
	
	public static function update_substance_term(){

		$tax = 'substance';
		
		if($_POST['data']){
			$term = $_POST['data'];

			$res = wp_update_term($term['term_id'], $tax, array(
						'name' => $term['name']						
			));
			
			// add term metas
			if(!is_wp_error($res)){
				$term_id = $res['term_id'];
				$meta_arr = self::get_substance_meta_keys();
				foreach ($meta_arr as $meta_key){
					if(isset($term[$meta_key])){				
						update_term_meta($term_id, $meta_key, $term[$meta_key]);
					}
				}
			}
			
		}
		
		self::fetch_substance_terms();
	}
	
	
	
	public static function update_substance_limits(){	
 		$tax = 'substance';
		
 		if($_POST['data']){
			$term = $_POST['data'];
			update_term_meta($term['term_id'], 'materials', $term['materials']);
		}

		self::fetch_substance_by_term_id($term['term_id']); 
	}
	
	
	
	public static function add_substance_term(){
		$tax = 'substance';
		
		if($_POST['data']){
			$term = $_POST['data'];
			if(! term_exists($term['name'], $tax)){ // don't add it if same name is already present 
				$res = wp_insert_term($term['name'], $tax);
				
				// add term metas
				if(!is_wp_error($res) ){
					$term_id = $res['term_id'];
					$meta_arr = self::get_substance_meta_keys();
					foreach ($meta_arr as $meta_key){
						if(isset($term[$meta_key])){
							add_term_meta ($term_id, $meta_key, $term[$meta_key], true);
						}						
					}
				}		
				
			}
		}
		
		self::fetch_substance_terms();
	}
	
	public static function delete_substance_term(){
		$tax = 'substance';
		
		if($_POST['data']){
			$term = $_POST['data'];
			
			self::prevent_delete_non_empty_term($term['term_id'], $tax);
			
			wp_delete_term($term_arr['term_id'], $tax);
		}
	
		self::fetch_substance_terms();
	}
	
	
	
	// ===========================================================
	//				Material Term CRUD
	// ===========================================================
	
	/**
	 * Return materials array with 'material' objects type: 
	 * {term_id: int, 
	 *  slug: string,
	 *  name: string,
	 *  description: string,
	 *  ....
	 * }
	 */
	public static function fetch_material_terms(){
	
		$terms = get_terms( array(
				'taxonomy' => 'material',
				'hide_empty' => false,
		));		

		if(is_wp_error($terms)){
			self::get_error_msg('WP_ERROR occured on fetch_material_terms');
		}
		
		echo json_encode((object)array('status'=>'ok', 'result' => $terms));
		wp_die();
	}
	
	
	public static function update_material_term(){
	
		$tax = 'material';
	
		if($_POST['data']){
			$term = $_POST['data'];
	
			$res = wp_update_term($term['term_id'], $tax, array(
					'name' => $term['name'],
					'description' => $term['description']
			));
				
		}
	
		self::fetch_material_terms();
	}
	
	public static function add_material_term(){
		$tax = 'material';
	
		if($_POST['data']){
			$term = $_POST['data'];
			if(! term_exists($term['name'], $tax)){
				$res = wp_insert_term($term['name'], $tax, array('description' => $term['description']));
			}
		}
	
		self::fetch_material_terms();
	}
	
	public static function delete_material_term(){
		$tax = 'material';
	
		if($_POST['data']){
			$term = $_POST['data'];
			self::prevent_delete_non_empty_term($term['term_id'], $tax);
			wp_delete_term($term_arr['term_id'], $tax);

		}
	
		self::fetch_material_terms();
	}
	
	
	
	// ===========================================================
	//				MeasureUnit Term CRUD
	// ===========================================================
	
	public static function fetch_measure_unit_terms(){
		$terms = get_terms( array(
				'taxonomy' => 'measure_unit',
				'hide_empty' => false,
		));
		
		if(is_wp_error($terms)){
			self::get_error_msg('WP_ERROR occured on fetch_measure_unit_terms');
		}
		
		echo json_encode((object)array('status'=>'ok', 'result' => $terms));
		wp_die();
	}
	
	
	public static function update_measure_unit_term(){
		$tax = 'measure_unit';
	
		if($_POST['data']){
			$term = $_POST['data'];
	
			wp_update_term($term['term_id'], $tax, array(
					'name' => $term['name']
			));
				
		}
	
		self::fetch_measure_unit_terms();
	}
	
	public static function add_measure_unit_term(){
		$tax = 'measure_unit';
	
		if($_POST['data']){
			$term = $_POST['data'];
			if(! term_exists($term['name'], $tax)){
				wp_insert_term($term['name'], $tax);
			}
		}
	
		self::fetch_measure_unit_terms();
	}
	
	public static function delete_measure_unit_term(){
		$tax = 'measure_unit';
	
		if($_POST['data']){
			$term = $_POST['data'];
				self::prevent_delete_non_empty_term($term['term_id'], $tax);
				
				wp_delete_term($term_arr['term_id'], $tax);
		}
	
		self::fetch_measure_unit_terms();
	}
	
	
	public static function do_logout(){
		wp_logout();
		
		echo json_encode( (object) array('result'=>'ok')) ;
		wp_die();
	}
	
}

Analyzes_Monitor_Ajax::init();