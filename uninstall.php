<?php
// If uninstall not called from WordPress exit
if( !defined( 'WP_UNINSTALL_PLUGIN' ) )
	exit ();

function ap_am_delete_taxonomies(){

	$constr_types_arr = array(
			'trans' ,
			'long'
	);

	$taxonomy = 'car';


	foreach ( $constr_types_arr as $type ){
		$term = get_term_by( 'slug', $type , $taxonomy );

		if( !is_wp_error( $term ) ){
			wp_delete_term( (int) $term->term_id, $taxonomy );
		}
	}
}

ap_am_delete_taxonomies();