<?php
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

class Analyzes_Monitor_Taxonomies{
	
	public static function init(){
		add_action('init', array(__CLASS__, 'register_taxonomies'));
	}
	
	public  static function register_taxonomies(){
		if(taxonomy_exists('substance')){
			return;
		}
		
		$substance_args = array(
				'hierarchical' => false,
				'query_var' => __('substance', 'ap_am' ),
				'show_tagcloud' => false,
				'rewrite' => array(
						'slug' => __('substance', 'ap_am' ),
						'with_front' => false
				),
				'labels' => array(
						'name' => __('Substances', 'ap_am' ),
						'singular_name' => __('Substance', 'ap_am' ),
						'edit_item' => __('Edit Substance', 'ap_am' ),
						'update_item' => __('Update Substance', 'ap_am' ),
						'add_new_item' => __('Add New Substance', 'ap_am' ),
						'new_item_name' => __('New Substance Name', 'ap_am' ),
						'all_items' => __('All Substances', 'ap_am' ),
						'search_items' => __('Search Substances', 'ap_am' ),
						'parent_item' => __('Parent Substance', 'ap_am' ),
						'parent_item_colon' => __('Parent Substance:', 'ap_am' ),
				),
		);
		
		register_taxonomy('substance', 'analyze', $substance_args);
		
		
		$material_args = array(
				'hierarchical' => false,
				'query_var' => __('material', 'ap_am' ),
				'show_tagcloud' => false,
				'rewrite' => array(
						'slug' => __('material', 'ap_am' ),
						'with_front' => false
				),
				'labels' => array(
						'name' => __('Materials', 'ap_am' ),
						'singular_name' => __('Material', 'ap_am' ),
						'edit_item' => __('Edit Material', 'ap_am' ),
						'update_item' => __('Update Material', 'ap_am' ),
						'add_new_item' => __('Add New Material', 'ap_am' ),
						'new_item_name' => __('New Material Name', 'ap_am' ),
						'all_items' => __('All Materials', 'ap_am' ),
						'search_items' => __('Search Materials', 'ap_am' ),
						'parent_item' => __('Parent Material', 'ap_am' ),
						'parent_item_colon' => __('Parent Material:', 'ap_am' ),
				),
		);
		
		register_taxonomy('material', 'analyze', $material_args);
		
		
		$measure_unit_args = array(
				'hierarchical' => false,
				'query_var' => __('measure_unit', 'ap_am' ),
				'show_tagcloud' => false,
				'rewrite' => array(
						'slug' => __('measure_unit', 'ap_am' ),
						'with_front' => false
				),
				'labels' => array(
						'name' => __('Measure Units', 'ap_am' ),
						'singular_name' => __('Measure Unit', 'ap_am' ),
						'edit_item' => __('Edit Measure Unit', 'ap_am' ),
						'update_item' => __('Update Measure Unit', 'ap_am' ),
						'add_new_item' => __('Add New Measure Unit', 'ap_am' ),
						'new_item_name' => __('New Measure Unit Name', 'ap_am' ),
						'all_items' => __('All Measure Units', 'ap_am' ),
						'search_items' => __('Search Measure Units', 'ap_am' ),
						'parent_item' => __('Parent Measure Unit', 'ap_am' ),
						'parent_item_colon' => __('Parent Measure Unit:', 'ap_am' ),
				),
		);
		
		register_taxonomy('measure_unit', 'analyze', $measure_unit_args);
	}
	
}


Analyzes_Monitor_Taxonomies::init();