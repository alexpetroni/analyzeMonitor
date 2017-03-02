<?php

show_admin_bar( false );

/**
 * Get the permalink for the plugin pages based on the slug provided in config
 *
 * @param unknown $slug
 * @return string|false
 */
function ap_am_get_url_for_page_slug($slug){
	$url = '';

	$pages_arr = Analyzes_Monitor_Config::get_plugin_pages_arr();

	foreach ($pages_arr as $p){
		if( $slug == $p['slug']){
			$post_id = get_option('analyzes_monitor_page_'.$p['slug']);
			$url = get_permalink($post_id);
			return $url;
		}
	}

	return $url;
}