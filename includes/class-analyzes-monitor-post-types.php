<?php
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

class Analyzes_Monitor_Posttype{
	
	public static function init() {
		add_action('init', array(__CLASS__, 'register_post_types') );
	}
	
	
	public static function register_post_types() {
		
		$analyze_labels = array(
				'name'               => _x( 'Analyzes', 'ap_am' ),
				'singular_name'      => _x( 'Analyze', 'ap_am' ),
				'menu_name'          => _x( 'Analyzes', 'ap_am' ),
				'name_admin_bar'     => _x( 'Analyze', 'ap_am' ),
				'add_new'            => _x( 'Add New', 'ap_am' ),
				'add_new_item'       => __( 'Add New Analyze', 'ap_am' ),
				'new_item'           => __( 'New Analyze', 'ap_am' ),
				'edit_item'          => __( 'Edit Analyze', 'ap_am' ),
				'view_item'          => __( 'View Analyze', 'ap_am' ),
				'all_items'          => __( 'All Analyzes', 'ap_am' ),
				'search_items'       => __( 'Search Analyzes', 'ap_am' ),
				'parent_item_colon'  => __( 'Parent Analyzes:', 'ap_am' ),
				'not_found'          => __( 'No Analyzes found.', 'ap_am' ),
				'not_found_in_trash' => __( 'No Analyzes found in Trash.', 'ap_am' )
		);
		
		$analyze_args = array(
				'public'	=> false,
				'query_var'	=> 'analyze',
				'labels'	=> $analyze_labels,
				'menu_position'	=> 5,
				'has_archive'	=> false,
				'supports'	=> array('page-attributes', 'title', 'editor', 'author', 'excerpt'),
				'hierarchical'	=> false
		);
				
		register_post_type('analyze', $analyze_args );
	}
	
}

Analyzes_Monitor_Posttype::init();