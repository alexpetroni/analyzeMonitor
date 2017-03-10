<?php
/**
 * The header for our theme
 *
 * This is the template that displays all of the <head> section and everything up until <div id="content">
 *
 * @link https://developer.wordpress.org/themes/basics/template-files/#template-partials
 *
 * @package WordPress
 * @subpackage Twenty_Seventeen
 * @since 1.0
 * @version 1.0
 */

?><!DOCTYPE html>
<html <?php language_attributes(); ?> class="no-js no-svg">
<head>
<meta charset="<?php bloginfo( 'charset' ); ?>">
<meta name="viewport" content="width=device-width, initial-scale=1">
<link rel="profile" href="http://gmpg.org/xfn/11">

<?php wp_head(); ?>
</head>

<body <?php body_class(); ?>>
<div id="page" class="site">

	<div class="site-content-contain">
		<div id="content" class="site-content">

<div class="wrap">
	<div id="primary" class="content-area">
		<main id="main" class="site-main" role="main">
		<div id="app">			
			<analyzes-menu 
				@navigate="onNavigate"
				@logout="onLogout">
			</analyzes-menu>
			
			
			<pre-loading v-if="currentView == 'pre-loading'">
			</pre-loading>
			
			<substance-editor v-if="currentView == 'substance-editor'" 
			:substances-list="substancesList" 
			:materials-list="materialsList"
			:measure-units-list="measureUnitsList" 
			@substanceedit="onSubstanceEdit">
			</substance-editor>
			
			
			<material-editor v-if="currentView == 'material-editor'" 
			:materials-list="materialsList" 
			@materialedit="onMaterialEdit">
			</material-editor>
			
			<unity-measure-editor v-if="currentView == 'unity-measure-editor'" 
			:measure-units-list="measureUnitsList" 
			@measureunitedit="onMeasureUnitEdit">
			</unity-measure-editor>
			
			<analyzes-monitor  v-if="currentView == 'analyzes-monitor'" 
			:substances-list="substancesList" 
			:materials-list="materialsList"
			:measure-units-list="measureUnitsList"
			:analyzes-list = "analyzesList"
			:current-substance="currentSubstance"
			:edited-analyze="editedAnalyze"
			:start-date="startDate"
			:end-date="endDate"
			>
			</analyzes-monitor>
			
			
			<print-graphics v-if="currentView == 'print-graphics'"
			:substances-list="substancesList" 
			:materials-list="materialsList"
			:measure-units-list="measureUnitsList"
			:analyzes-list = "analyzesList"
			:current-substance="currentSubstance"
			:start-date="startDate"
			:end-date="endDate"
			></print-graphics>
			
			<print-table v-if="currentView == 'print-table'"
			:substances-list="substancesList" 
			:materials-list="materialsList"
			:measure-units-list="measureUnitsList"
			:analyzes-list = "analyzesList"
			:current-substance="currentSubstance"
			:start-date="startDate"
			:end-date="endDate"
			
			></print-table>
		</div>

		</main><!-- #main -->
	</div><!-- #primary -->
	<?php //get_sidebar(); ?>
</div><!-- .wrap -->

		</div><!-- #content -->

	</div><!-- .site-content-contain -->
</div><!-- #page -->
<?php wp_footer(); ?>
<div class="footerSpacer"></div>
</body>
</html>
