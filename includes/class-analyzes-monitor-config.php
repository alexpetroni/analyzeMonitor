<?php
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}


class Analyzes_Monitor_Config{
	
	public static function get_plugin_pages_arr() {
		$pages_arr = array(
				array( 'title' => __('Signup', 'analyzesmonitor'), 'template' => 'analyzes-monitor-signup.php', 'slug' => 'signup'),		// create login page
				
				array( 'title' => __("Analyzes dashboard", 'analyzesmonitor'), 'template' => 'analyzes-monitor-dashboard.php', 'slug' => 'analyzes-dashboard', 'main-menu'=>1),	// create landing page home
				
		);
		return $pages_arr;
	}
	
	
	public static function get_plugin_pages_templates_arr() {
		$templates_arr = array();
		
		$pages_arr = self::get_plugin_pages_arr();
		
		foreach ($pages_arr as $page){
			$templates_arr[] = $page['template'];
		}
		
		return $templates_arr;
	}
	
	
	public static function get_plugin_pages_slugs_arr() {
		$templates_arr = array();
	
		$pages_arr = self::get_plugin_pages_arr();
	
		foreach ($pages_arr as $page){
			$templates_arr[] = $page['slug'];
		}
	
		return $templates_arr;
	}
	
}