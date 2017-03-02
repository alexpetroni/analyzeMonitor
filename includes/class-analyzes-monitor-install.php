<?php
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}
class Analyzes_Monitor_Install{
	
	public static function activation(){
		add_option( 'analyzes-monitor-activated', '1' );
		error_log('ACTIVARED Analyzes_Monitor_Install ');
	}
	
	public static function deactivation(){
		error_log(' deactivation() ');
	}
	
	
	public static function perform_instalation(){
		error_log(' perform_instalation() ');
		delete_option( 'analyzes-monitor-activated' );
		
		
		$pages_arr = Analyzes_Monitor_Config::get_plugin_pages_arr();
		
		
		$page_args = array(
				'post_type'	=> 'page',
				'post_content'	=> '',
				'post_name'	=>  '',
				'post_status'	=> 'publish',
				'comment_status'	=> 'closed'
		);
		
		foreach ( $pages_arr as $page ){
			if ( null == get_page_by_title($page['title']) ){
				
				$page_args['post_title'] = $page['title'];
				
				$post_id = wp_insert_post($page_args);
				
				if( ! is_wp_error( $post_id ) ){
					update_post_meta($post_id, '_wp_page_template', $page['template']);
					if( ! empty($page['slug']) ){
						update_option('analyzes_monitor_page_'.$page['slug'], $post_id);
					}
				}
			}
		}		
		
	}

}