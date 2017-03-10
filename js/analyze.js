/**
 * 
 */
//=============================================================
//			Just a model for the objects passed in app, not used anywhere
//=============================================================

	function am_ap_getNewAnalyze(title){
		return {
			title: title, // each analyze is a 'analyze' post-type with titel in format YYYY-MM-DD
			id: -1,
			substances: [ // array of substances
			              { substance_id: '-1', // substance term_id
			                register_time: '12:00',
			                values: [ // array of values for each material in the substance
			                         { 	
			                           	val: '14.90',  // registered value
                                     	mat_id: 4,     // material term_id
                                     	mat_description: 'lot 1 exp:22.05.2018',
                                     	mu_id: 2 // measure unit term_id
			                         }
			                		]
			              } ]			
		}
	}
	
	function am_ap_getNewSubstance(){
		return {
			term_id: -1,
			slug: "",
			name: "",
			materials: [], // array with materials term_id's
			measure_unit: -1, // the term_id for measure_unit			
		}
	}
	
	function am_ap_getNewMaterial(){
		return {
			term_id: -1, 
			slug: '',
			name: '',
			description: '',
			count: 0,
			taxonomy: 'material'			
		}
	}
	
	function am_ap_getNewMeasureUnit(){
		return {
			term_id: -1, 
			slug: '',
			name: '',
			description: '',
			count: 0,
			taxonomy: 'measure_unit'			
		}
	}

//=============================================================
//						general common fuctions for components
//=============================================================

var appFunc = {	
		
	getAnalyzeSubstanceById: function (analyze, substanceTermId){
		if(! analyze.substances) return undefined;
		
		var length = analyze.substances.length;
		
		for(var i = 0; i < length; i++){
			if(analyze.substances[i]['substance_id'] == substanceTermId){
				return analyze.substances[i];
			}
		}
		
		return undefined
	},
	
	getMaterialNameById(materialsArr, materialTermId){
		var length = materialsArr.length;
		
		for(var i = 0; i < length; i++){
			if(materialsArr[i]['term_id'] == materialTermId){
				return materialsArr[i]['name'];
			}
		}
		
		return ''
	},
	
	getMaterialDescriptionById(materialsArr, materialTermId){
		var length = materialsArr.length;
		
		for(var i = 0; i < length; i++){
			if(materialsArr[i]['term_id'] == materialTermId){
				return materialsArr[i]['description'];
			}
		}
		
		return ''
	},
	
	getSubstanceMaterialValueById(substance, materialTermId){
		var length = substance.values.length;
		
		for(var i = 0; i < length; i++){
			if(substance.values[i]['mat_id'] == materialTermId){
				return substance.values[i]['val'];
			}
		}
		
		return ''
	},
	
	getMeasurUnitNameById(muArr, termId){
		var length = muArr.length;
		
		for(var i = 0; i < length; i++){
			if(muArr[i]['term_id'] == termId){
				return muArr[i]['name'];
			}
		}
		
		return ''
	}
}




//=============================================================
//						preload component
//=============================================================
Vue.component('pre-loading', {
	template: `
		<div>
		<div class='row'>
			<div class="col-sm-12 text-center">
				<br><br><br><br><br>
				<small style="color:#999;"> ... </small>
			</div>
		</div>
		</div>
	`
});



//=============================================================
//						analyzes menu component
//=============================================================
Vue.component('analyzes-menu', {
	data: function(){
		return {}
	}, 
	
	methods: {
		navigateTo(view){
			this.$emit('', view);
		}
	},
	
	directives: {
		toggleMenu: {
			bind(el, binding, vnode){
				el.addEventListener("click", function(){
					el.classList.toggle('open')
				})

				el.addEventListener("mouseleave", function(){
					el.classList.remove('open')
				})

			}
		}
	},
		  
	template: `  <nav class="navbar navbar-default">
    <div class="container-fluid">
    <!-- Brand and toggle get grouped for better mobile display -->
    <div class="navbar-header">
      <button type="button" class="navbar-toggle collapsed" data-toggle="collapse" data-target="#bs-example-navbar-collapse-1" aria-expanded="false">
        <span class="sr-only">Toggle navigation</span>
        <span class="icon-bar"></span>
        <span class="icon-bar"></span>
        <span class="icon-bar"></span>
      </button>
      <a class="navbar-brand" style="font-weight:bold;"><span class="dashicons dashicons-chart-line"></span> Monitorizare analize</a>
    </div>

    <!-- Collect the nav links, forms, and other content for toggling -->
    <div class="collapse navbar-collapse" id="bs-example-navbar-collapse-1">
      <ul class="nav navbar-nav">
        <li><a href="" @click.prevent="$emit('navigate', 'analyzes-monitor')">Grafice <span class="sr-only">(current)</span></a></li>
        <li  class="dropdown" v-toggle-menu>
          <a class="dropdown-toggle" data-toggle="dropdown" role="button" aria-haspopup="true" aria-expanded="false">Tipărire <span class="caret"></span></a>
          <ul class="dropdown-menu">
            <li><a href="#" @click.prevent="$emit('navigate', 'print-graphics')">Grafice</a></li>
            <li><a href="#" @click.prevent="$emit('navigate', 'print-table')">Tabel date</a></li>
          </ul>
        </li>
      </ul>

      <ul class="nav navbar-nav navbar-right">
        
        <li class="dropdown" v-toggle-menu>
          <a class="dropdown-toggle" data-toggle="dropdown" role="button" aria-haspopup="true" aria-expanded="false">Setări<span class="caret"></span></a>
          <ul class="dropdown-menu">
            <li><a href="#" @click.prevent="$emit('navigate', 'substance-editor')">Tipuri de analize</a></li>
            <li><a href="#" @click.prevent="$emit('navigate', 'material-editor')">Tipuri de materiale</a></li>
            <li><a href="#" @click.prevent="$emit('navigate',  'unity-measure-editor')">Unități de măsură</a></li>
          </ul>
        </li>
        <li><a href="#" @click.prevent="$emit('logout')">Logout</a></li>
      </ul>
    </div><!-- /.navbar-collapse -->
  </div><!-- /.container-fluid -->
</nav>`
});



//=============================================================
//						substance-editor component
//=============================================================
Vue.component('substance-editor', {
	props: ['substancesList', 
	        'materialsList',
	        'measureUnitsList'],
	
	data:function(){
		return {
			editedItem: this.getNewEditedItem(),
			editState: 'add',
			decimalsOptions: [0, 1, 2, 3],
			levelsOptions: [1, 2, 3, 4, 5],
			levels: 2
		}		
	},
	
	methods: {
		onSubmit: function(){
			this.$emit('substanceedit', {action: this.editState, item: this.editedItem});
			this.editState = 'sending';
		},
		
		onCancel: function(){
			this.setNewState()
		},
		
		getNewEditedItem: function(){
			return {
				name: '',
				decimals: 2,
				measure_unit: null,
				materials: [{term_id:null},{term_id: null}]
			}
		},
		
		setEditedItem(item){
			this.editedItem = JSON.parse(JSON.stringify(item));
			this.editState = 'update';
		},
		
		deleteItem(item){
			if(confirm("Esti sigur ca vrei sa stergi?")){
				this.$emit('substanceedit', {action: 'delete', item: item});
				this.editState = 'sending';
			}
		},		
		
		setNewState(){
			this.editedItem = this.getNewEditedItem();
			this.editState = 'add';
		},
		
		getMeasurUnitName(muId){
			var m = this.measureUnitsList.find(function(m){
				return m.term_id == muId
			})
			if(m){
				return m.name
			}
			return '';
		},		
		
		onLevelsChanged(event){
			var val = event.target.value;
			if(this.editedItem.materials.length < val){
				while(this.editedItem.materials.length < val){
					this.editedItem.materials.push({term_id:null});
				}
			}else if(this.editedItem.materials.length > val){
				this.editedItem.materials.splice(val);
			}	
		},
		
		materialsNamesAsTxt(itemMaterialsArr){
			var mat_arr = [];
			for(var i = 0; i<itemMaterialsArr.length; i++){
				var mat_term_id = itemMaterialsArr[i]['term_id'];
				if(mat_term_id){
					for(var j=0; j<this.materialsList.length; j++){
						if(this.materialsList[j]['term_id'] == mat_term_id){
							mat_arr.push(this.materialsList[j]['name']);
							break;
						}
					}				
				}
				
			}
			
			return mat_arr.join(', ');
		}
		
		
	},
	
	watch: { // clearing edit fields after update
		'substancesList': function(){
			if(this.editState == 'sending'){
				this.setNewState();
			}
		}
	},
	
	computed: {
		textSubmitBtn: function(){
			if(this.editState == 'add') {
				return 'Add' 
			}else if(this.editState == 'update'){
				return 'Update'
			}else{
				return 'Sending'
			}
		},
		
		isValid: function(){
			if( !(this.editedItem.name.trim() && this.editedItem.measure_unit)){
				return false;
			}
			
			var selectedMaterials = [];
			
			for(var i = 0; i < this.editedItem.materials.length; i++){
				selectedMaterials.push(this.editedItem.materials[i]['term_id'])
				if(!this.editedItem.materials[i]['term_id']){
					return false;
				}
			}
			
			// check that each material is unique
			
			for(var i = 0; i < selectedMaterials.length; i++){
				if(i != selectedMaterials.indexOf(selectedMaterials[i])){
					return false
				}
			}
			
			return true;
		},
		
		levels: function(){
			return this.editedItem.materials.length;
		},
		

		
		
	},	
	
	template: `
		<div class="container">
	<div class="row">
	<div class="col-sm-12">
		<h2>Editor tipuri analize</h2>
	</div>
	

	<div class="col-sm-12">
		<div class="row">
			<form @submit.prevent="onSubmit" class="form-inline">
			  <div class="form-group">
			    <label class="col-sm-3 control-label" for="itemName">Nume analiza</label>
			    <input class="form-control" v-model="editedItem.name" id="itemName">			    
			  </div>
			  
			  <div class="form-group">
			    <label class="col-sm-5 control-label" for="itemLevels">Număr nivele</label>
			    <select class="form-control" v-model="levels"  id="itemLevels" @change="onLevelsChanged">
		    		<option v-for="i in levelsOptions" v-bind:value="i">{{ i }}</option>
		    	</select>
			  </div>
			  
			  <div class="form-group">
			  	<label class="col-sm-6 control-label" for="itemMeasureUnit">Unitate de măsură</label>
			  	<select class="form-control" id="itemMeasureUnit" v-model="editedItem.measure_unit">
			  		<option v-for="(option, index) in measureUnitsList" v-bind:value="option.term_id" selected="index == 0">{{ option.name }}</option>
			  	</select>  
			  </div>
			  
			  <div class="form-group">
			    <label class="col-sm-5 control-label" for="itemDecimals">Număr zecimale</label>
			    <select class="form-control" v-model="editedItem.decimals"  id="itemDecimals">
			    	<option v-for="i in decimalsOptions" v-bind:value="i">{{ i }}</option>
			    </select>
			  </div>
			  <br/>
			  <br/>

			  
			  	
				  	<div class="form-group" v-for="(item, index) in editedItem.materials">
				  	 <label class="col-sm-6 control-label" :for="'level_' +index">Material nivel {{ index+1 }}</label>
					  	
					  		<select v-model='item.term_id' class="form-control" :id="'level_' +index">
					  			<option v-for="mat in materialsList" :value="mat.term_id">{{mat.name}}</option>
					  		</select>
					  	
					</div>
			  	
					 <br/>
					  <br/>
			  	<div class="col-sm-12 text-center">
				<button type="submit" class="btn btn-primary"  :disabled="!isValid">{{ textSubmitBtn }}</button>
				<button type="button" @click.prevent="onCancel" class="btn btn-warning">Cancel</button>
				</div>
			</form>		
			<br/> <br/>
		</div>
		</div>
			
		<div class="row">
		<div class="col-sm-12">
		 <br/>
		  <br/>
		<table  class="table">
		 <thead>
		  <tr>
		     <th>Nume analiza</th>
		     <th  class="text-center">Număr nivele</th>	
		     <th  class="text-center">Materiale</th>	
		     <th  class="text-center">Unitate de măsură</th>
		     <th  class="text-center">Număr zecimale</th>
		     <th></th>
		     <th></th>
		  </tr>
		 </thead>
		 <tbody>
			<tr v-for="item in substancesList" >
			<td> {{ item.name }} </td>
			<td class="text-center"> {{ item.materials.length }} </td>	
			<td class="text-center"> {{ materialsNamesAsTxt(item.materials) }} </td>	
			<td class="text-center"> {{ getMeasurUnitName(item.measure_unit) }} </td>
			<td class="text-center"> {{ item.decimals }} </td>
			<td> <span class="dashicons dashicons-edit action" @click="setEditedItem(item)"></span> </td>
			<td> <span @click="deleteItem(item)" class="dashicons dashicons-trash action"> </a></td>
			</tr>
		</tbody>
		</table>
		</div>
		</div>
		</div>
	`
});



//=============================================================
//				unity-measure-editor component
//=============================================================
Vue.component('unity-measure-editor', {
	props: ['measureUnitsList'],

	data:function(){
		return {
			editedItem: this.getNewEditedItem(),
			editState: 'add'
		}		
	},

	methods: {
		onSubmit: function(){
			this.$emit('measureunitedit', {action: this.editState, item: this.editedItem});
			this.editState = 'sending';
		},

		onCancel: function(){
			this.setNewState()
		},

		getNewEditedItem: function(){
			return {
				name: ''
			}
		},

		setEditedItem(item){
			this.editedItem = JSON.parse(JSON.stringify(item));
			this.editState = 'update';
		},

		deleteItem(item){
			if(confirm("Esti sigur ca vrei sa stergi?")){
				this.$emit('measureunitedit', {action: 'delete', item: item});
			}
		},		

		setNewState(){
			this.editedItem = this.getNewEditedItem();
			this.editState = 'add';
		}


	},

	watch: {
		'measureUnitsList': function(){
			if(this.editState == 'sending'){
				this.setNewState();
			}
		}
	},

	computed: {
		textSubmitBtn: function(){
			if(this.editState == 'add') {
				return 'Add' 
			}else if(this.editState == 'update'){
				return 'Update'
			}else{
				return 'Sending'
			}
		},
		
		isValid: function(){
			return this.editedItem.name.trim();
		}
	},	

	template: `
	<div class="container">

	<h2>Editor unități de măsură</h2>
	<form @submit.prevent="onSubmit" class="form-inline">
	
	  <div class="form-group">
	  	<input v-model="editedItem.name" id="itemMeasureUnit" class="form-control" placeholder="unitate de măsură">
	  </div>
	
	<button type="submit" class="btn btn-primary" :disabled="!isValid">{{ textSubmitBtn }}</button>
	<button type="button" @click="onCancel" class="btn btn-warning">Cancel</button>
	</form>
	<br>
	<br>
	<div class="row">
	<div class="col-sm-8">
	
	<table  class="table">
		<thead>
			  <tr>
			     <th>Nume unitate măsură</th>
			     <th></th>
			     <th></th>
			  </tr>
	  	</thead>
	 	<tbody>
	 		<tr v-for="item in measureUnitsList" >
	 		<td>{{ item.name }}</td>
	 		<td> <span class="dashicons dashicons-edit action" @click="setEditedItem(item)"></span> </td>
	 		<td> <span @click="deleteItem(item)" class="dashicons dashicons-trash action"> </a></td>
	 		</tr>
		</tbody>
	</table>
	
	</div>
	</div>
	</div>
	`
});



//=============================================================
//			material-editor component
//=============================================================

Vue.component('material-editor', {
	props: ['materialsList'],

	data:function(){
		return {
			editedItem: this.getNewEditedItem(),
			editState: 'add'
		}		
	},

	methods: {
		onSubmit: function(){
			this.$emit('materialedit', {action: this.editState, item: this.editedItem});
			this.editState = 'sending';
		},

		onCancel: function(){
			this.setNewState()
		},

		getNewEditedItem: function(){
			return {
				name: '',
				description: ''
			}
		},

		setEditedItem(item){
			this.editedItem = JSON.parse(JSON.stringify(item));
			this.editState = 'update';
		},

		deleteItem(item){
			if(confirm("Esti sigur ca vrei sa stergi?")){
				this.$emit('materialedit', {action: 'delete', item: item});
			}
		},		

		setNewState(){
			this.editedItem = this.getNewEditedItem();
			this.editState = 'add';
		}


	},

	watch: {
		'materialsList': function(){
			if(this.editState == 'sending'){
				this.setNewState();
			}
		}
	},

	computed: {
		textSubmitBtn: function(){
			if(this.editState == 'add') {
				return 'Add' 
			}else if(this.editState == 'update'){
				return 'Update'
			}else{
				return 'Sending'
			}
		},

		isValid: function(){
			return this.editedItem.name.trim();
		}
	},	

	template: `
	<div class="container">
	<div class="row">
	<div class="col-sm-12">
	<h2>Editor tipuri materiale</h2>
	</div>
	<div class="col-sm-12">
	<form @submit.prevent="onSubmit" class="form-inline">

	<div class="form-group">
	<input v-model="editedItem.name" id="itemMaterial" class="form-control" placeholder="material">
	<input v-model="editedItem.description" id="itemMaterialDescription" class="form-control" placeholder="descriere implicita">
	</div>

	<button type="submit" class="btn btn-primary" :disabled="!isValid">{{ textSubmitBtn }}</button>
	<button type="button" @click="onCancel" class="btn btn-warning">Cancel</button>
	</form>
	</div>
	</div>
	<br>
	<br>
	<div class="row">
	<div class="col-sm-8">

	<table  class="table">
	<thead>
	<tr>
	<th>Nume material</th>
	<th>Descriere</th>
	<th></th>
	<th></th>
	</tr>
	</thead>
	<tbody>
	<tr v-for="item in materialsList" >
	<td>{{ item.name }}</td>
	<td>{{ item.description }}</td>
	<td> <span class="dashicons dashicons-edit action" @click="setEditedItem(item)"></span> </td>
	<td> <span @click="deleteItem(item)" class="dashicons dashicons-trash action"> </a></td>
	</tr>
	</tbody>
	</table>

	</div>
	</div>
	</div>
	`
});


//=============================================================
//		analyzes monitor component
//=============================================================
Vue.component('analyzes-monitor', {
	data: function(){
		return {
			currentView: 'analyzes-editor'
		}
	},
	props: [ 
	        'substancesList',
	        'materialsList',
	        'measureUnitsList',
	        'analyzesList',
	        'currentSubstance',
			'editedAnalyze',
	        'startDate',
	        'endDate'
	        ],
	        
	methods: {
		onChangeView(data){
			this.currentView = this.currentView == 'analyzes-editor' ? 'analyzes-limits-editor' : 'analyzes-editor';
		}
	},
	
	template: `<div class="container">
		<div class="row">
			<div class="col-sm-9">
				<analyzes-graphic-container
				v-if="currentSubstance"
				:analyzes-list="analyzesList"
				:current-substance="currentSubstance"
				:measure-units-list="measureUnitsList"
				:start-date="startDate"
				:end-date="endDate"				
				>
				</analyzes-graphic-container>
			</div>
			<div class="col-sm-3">
			<analyzes-editor 
				v-if="currentSubstance" v-show="currentView == 'analyzes-editor'"				
				:substances-list="substancesList" 
				:current-substance="currentSubstance"
				:measure-units-list="measureUnitsList"
				:materials-list="materialsList"
				:edited-item="editedAnalyze"
				@changeView="onChangeView"
				>
			</analyzes-editor>
			
			<analyzes-limits-editor 
			v-if="currentSubstance  && currentView == 'analyzes-limits-editor'"				
			:substances-list="substancesList" 
			:current-substance="currentSubstance"
			:measure-units-list="measureUnitsList"
			:materials-list="materialsList"			
			@changeView="onChangeView"
			>
		</analyzes-editor>
			</div>	
		</div>
	</div>
	`
});




//=============================================================
//		analyzes edit component
//=============================================================
Vue.component('analyzes-editor', {
props: ['measureUnitsList', 
        'substancesList', 
        'currentSubstance',
        'materialsList',
        'editedItem'
        ],

data: function(){
	return {
		editedItemSubstance:{},
		flatpikr: {}
	}
},

methods:{
	changeView(){
		this.$emit('changeView');
	},
	
	editedItemDateChanged(event){
		var date = event.detail.dateStr.substr(0, 10);
		var time = event.detail.dateStr.substr(11);

		if(date != this.editedItem.title ){
			bus.$emit('editedItemDateChanged', date)		
		}else{ // if it was only to change the record_time
			if(this.editedItemSubstance){
				this.editedItemSubstance.register_time = time;
			}
		}
	},
	
	
	setEditedItem(item){
		this.createEditedItemSubstance();
	},
	
	createEditedItemSubstance(){			

		var itemSubstance = appFunc.getAnalyzeSubstanceById(this.editedItem, this.currentSubstance.term_id);
		
		if(!itemSubstance){
			itemSubstance = {values:[]}
		}
		

		
		var material_terms = []
		
		for(var i = 0; i < this.currentSubstance.materials.length; i++){
			material_terms.push(this.currentSubstance.materials[i].term_id)
		}
		
		var values = []

		for(var i = 0 ; i < material_terms.length; i++){
			var row = {};

			row['val'] = appFunc.getSubstanceMaterialValueById(itemSubstance, material_terms[i]) 
			row['mat_id'] = material_terms[i] 
			row['mat_description'] = appFunc.getMaterialDescriptionById(this.materialsList, material_terms[i]) 
			row['mu_id'] = this.currentSubstance['measure_unit']
			values[i] = row;
		}
		
		var edItemSub = {};
		
		edItemSub.values = values;
		edItemSub.substance_id = this.currentSubstance.term_id;
		edItemSub.comment = itemSubstance.comment;
		edItemSub.register_time = itemSubstance.register_time ? itemSubstance.register_time : moment().format('H:mm');
		
		
		this.editedItemSubstance = edItemSub;
		this.updateFlatpikrDate(this.editedItem.title, this.editedItemSubstance.register_time)
		
		console.log('this.editedItemSubstance ')
		console.log(this.editedItemSubstance )
	},
	
	resetEditedSubstance(){
		this.createEditedItemSubstance();
	}, 
	

	updateFlatpikrDate(date, time){
		let d = date ? date : moment().format('YYYY-MM-DD')
		d += ' '+ (time ? time : moment().format('H:mm') )
		
		this.flatpikr.setDate(d);
	},
	
	
	onSubmit(){
		
		var editSubstId = this.editedItemSubstance.substance_id;
		
		var index = this.editedItem.substances.findIndex(function(el){return el.substance_id == editSubstId; })
		if(index == -1){
			this.editedItem.substances.push(this.editedItemSubstance);
		}else{
			this.editedItem.substances.splice(index, 1, this.editedItemSubstance);
		}

		var action = 'update_analyze';			
		var comp = this;		
		
		
		jQuery.post(
				ajax_obj.ajax_url, 
			    {
			        'action': action,
			        'data':   this.editedItem
			    }, 
			    function(response){
			    	
			    	var r = JSON.parse(response)
			    	if(r.status == 'error'){
			    		alert(r.msg);
			    		return;
			    	}
			    	
			    	if(r.result){ // if is an edit request
			    		//comp.setEditedItem(r.result);
			    		bus.$emit('analyzeUpdated', r.result);
			    	}
			    }
			);
	}
	
	
},

computed: {
	isDisabled: function(){ // disable until loaded
		return (this.measureUnitsList && this.measureUnitsList.length == 0) || (this.substancesList && this.substancesList.length == 0)
	},
	

	
	currentSubstanceMU: function(){
		var term_id = this.currentSubstance.measure_unit;
		var mu = this.measureUnitsList.find( function(item){ return item.term_id == term_id });
		if(mu){
			return mu.name;
		}
		return '';
	},
	
	currentSubstanceSlug: function(){
		return this.currentSubstance.slug;
	},
	
	inputRegExpPattern: function(){
		var decimals = this.currentSubstance.decimals;
		
		var regPattern = '\\d+';
		if(decimals){
			regPattern += '\\.\\d{'+decimals+'}\$';
		}
		
		return regPattern;
	},
	
	formIsValid: function(){
		var isValid = true;
		var decimals = this.currentSubstance.decimals;
		
		var matArr = this.editedItemSubstance.values;
		
		var regPattern = '^\\d+';
		if(decimals){
			regPattern += '\\.\\d{'+decimals+'}';
		}
		regPattern +='$'
		
		var regexp = new RegExp(regPattern); 
		
		if(matArr){
			
			for(var i = 0; i < matArr.length; i++){
				
				var v = matArr[i]['val'];
				var c = regexp.test(v);
				if(v && !regexp.test(v)){	
					isValid = false
				}
			}
			
		}
		
		return isValid;
	}
},

watch: {
	
	'isDisabled': function(){
	},
	
	'currentSubstance': function(){
		this.createEditedItemSubstance();
	},
	
	'editedItem': function(){
		this.setEditedItem(this.editedItem)
	},
},

mounted: function(){
	this.flatpikr = flatpickr("#editedItemDate",{
		
		"locale": "ro",
		enableTime: true,
		defaultDate:new Date(),
		maxDate: new Date(),		
		
		//altInput: true,
		//altFormat: "j F, Y h:i K",
		
		onChange: function(selectedDates, dateStr, instance) {
			let event = new CustomEvent('dateChanged',  {detail:{
				selectedDates: selectedDates,
				dateStr: dateStr
	        }});
			instance.element.dispatchEvent(event);
		}

		})
	
		this.setEditedItem(this.editedItem)
		
		
},

template: `
	<div>
	
	<div class="panel panel-primary">
	<div class="panel-heading"><strong>{{ currentSubstance.name}}</strong></div>
	<div class="panel-body">
	
	
	<form @submit.prevent="onSubmit">
		<input  id="editedItemDate" @dateChanged="editedItemDateChanged" class="form-control" type="text" placeholder="Selecteaza Data..">
		<br />
			<div class="analyzeWrapper">
			<div v-for="(mat, index) in editedItemSubstance.values">
			<div class="row">
					<div class="form-group">
							<label class="col-sm-12 text-center" :for="'check_'+index">{{ appFunc.getMaterialNameById(materialsList, mat.mat_id) }}</label>
							<div class="col-sm-8 col-sm-offset-2">
								<div class="input-group">
									<input :id="'check_'+index" type="text" v-model="mat.val" class="form-control" placeholder="valoare">	
									<div class="input-group-addon">{{ appFunc.getMeasurUnitNameById(measureUnitsList, mat.mu_id) }}</div>
								</div>
							</div>
							<br /><br>
					</div>
			</div>
					
			<br>
					<div class="form-group">
											
						<input :id="'description_'+index" type="text" v-model="mat.mat_description" class="form-control">		
					
					</div>

			</div>	
			
			
			</div>
			
			
			<div class="form-group">
				<label class="control-label" for="analyze_comment">Comentariu</label>
				<input id="analyze_comment" type="text" v-model="editedItemSubstance.comment" class="form-control form-inline">
			</div>
		<div class="text-right"><span class="dashicons dashicons-info" data-toggle="tooltip" title="Pentru salvare este necesar ca valorile sa aiba numarul de zecimale specificate in setari."></span></div>
		<div class="text-center">
		<button type="submit" class="btn btn-primary" :disabled="!formIsValid">Salvează</button>
		<button type="button" class="btn btn-warning" @click="resetEditedSubstance">Resetează</button>
		</div>

		
	</form>
	</div>
	</div>
	
	<div class="text-center"><button class="btn btn-primary" @click="changeView">Setari limite</button></div>
	
	<br>
	<substance-select :substances-list="substancesList" :current-substance="currentSubstance"></substance-select>
	
	

	
	</div>
	`
});

//=============================================================
// substance-select component
//=============================================================
Vue.component('substance-select', {
	props: [ 
	'substancesList', 
	'currentSubstance',
	],
	
	
	methods: {
		currentSubstanceChanged(item){
			bus.$emit('currentSubstanceChanged', item);
		}
	},


	template: `	
	<div class="panel panel-primary">
	<div class="panel-heading"><strong>Analytes</strong></div>
	<div class="panel-content">
	<form>
	
	<select size="10" class="form-control">
		<option v-for="item in substancesList" 
			@click="currentSubstanceChanged(item)"
			:selected="item.term_id == currentSubstance.term_id"
			>{{ item.name }}</option>
	</select>

	</form>
	</div>
	</div>
	`
});




//=============================================================
//		analyzes limits edit component
//=============================================================
Vue.component('analyzes-limits-editor', {
	props: [ 
		'substancesList', 
		'currentSubstance',
        'materialsList',
        'measureUnitsList'
		],
		
	data: function(){
			return {
				editedItem: {},
			}
		},

	methods: {
		changeView(){
			this.$emit('changeView');
		},
				
		createEditedItem(){
			var item = JSON.parse(JSON.stringify(this.currentSubstance));
			
			var limits_names = ['target_val', 'warning_val', 'alert_val']
			
			for(var i = 0 ; i < this.currentSubstance.materials.length; i++ ){
				
				limits_names.forEach(function(limit){
					if(!item.materials[i][limit]){
						item.materials[i][limit] = '';
					}
				})
			}
			
			this.editedItem = item;	
		},
		
		onSubmit(){	
			var item = JSON.parse(JSON.stringify(this.editedItem));
			bus.$emit('substanceLimitsEdit', {item:item});			
		},
		
		currentSubstanceChanged(item){
			alert('changed');
			bus.$emit('currentSubstanceChanged', item);
		},
		
		resetEditedSubstance(){
			
		},
	},
	
	
	watch: {
		
		'isDisabled': function(){
		},
		
		'currentSubstance': function(){
			this.createEditedItem();
		}
	},
	
	mounted: function(){
		this.createEditedItem();
	},

	template: `
<div>
	<div class="panel panel-primary">
	<div class="panel-heading"><strong>{{ currentSubstance.name}}</strong></div>
	<div class="panel-body">
	


	<div class="row">
	<form @submit.prevent="onSubmit" >
	
	<div v-for="(mat, index) in editedItem.materials">
		<div class="col-sm-12 "><strong >{{ appFunc.getMaterialNameById(materialsList, mat.term_id) }}</strong></div>
		
		<div class="form-group">
			<label class="col-sm-7" :for="'target_'+index">Valoare tinta ({{ appFunc.getMeasurUnitNameById(measureUnitsList, currentSubstance['measure_unit']) }})</label>
			<div class="col-sm-5">
				
					<input :id="'target_'+index" type="text" v-model="mat.target_val" class="form-control" >	
			</div>
		</div>

			<div class="col-sm-12">Deviatii acceptate inainte de:</div>
	
			<div class="form-group">
				<label class="col-sm-7" :for="'warning_'+index">Atentionare</label>
				<div class="col-sm-5">
					<input :id="'warning_'+index" type="text" v-model="mat.warning_val" class="form-control" placeholder="valoare">	
				</div>
			</div>

			<div class="form-group">
				<label class="col-sm-7" :for="'alert_'+index">Alerta</label>
				<div class="col-sm-5">
					<input :id="'alert_'+index" type="text" v-model="mat.alert_val" class="form-control" placeholder="valoare">	
				</div>
			</div>
			
			<div class="col-sm-12">&nbsp;</div>
	</div>
	
	
	
		<div class="col-sm-12 text-center">
			<button type="submit" class="btn btn-primary">Salvează</button>
			<button type="button" class="btn btn-warning" @click="resetEditedSubstance">Resetează</button>
		</div>
	</form>	
	</div><!-- row -->
	</div>
	</div>
	
	<div class="text-center"><button class="btn btn-primary" @click="changeView">Editare QC </button></div>
	<br>
	<substance-select :substances-list="substancesList" :current-substance="currentSubstance"></substance-select>
</div>
	`
});




//=============================================================
//		analyzes graphics container component
//=============================================================
Vue.component('analyzes-graphic-container', {
	props: ['measureUnitsList', 
	        'substancesList',
	        'currentSubstance',
	        'analyzesList',
	        'startDate',
	        'endDate',
	        'forPrint'
	        ],
	        
	data: function(){
		return {
			
		}
	},
	
	methods: {
		onDateChange(event){
			var date = event.detail.dateStr.substr(0, 10);
			var time = event.detail.dateStr.substr(11);
			
			bus.$emit(event.type, date);
		},
		
		
		standardDeviation(values){
			  var avg = this.average(values);
			  
			  var squareDiffs = values.map(function(value){
			    var diff = value - avg;
			    var sqrDiff = diff * diff;
			    return sqrDiff;
			  });
			  
			  var avgSquareDiff = this.average(squareDiffs);

			  var stdDev = Math.sqrt(avgSquareDiff);
			  return stdDev;
			},

		average(data){
			  var sum = data.reduce(function(sum, value){
			    return sum + value;
			  }, 0);

			  var avg = sum / data.length;
			  return avg;
			}

	},
	
	
	computed:{		
		
		graphicsData: function(){
			
			// days as labels
			var labels = []
			
			this.analyzesList.forEach(function(e){		
				labels.push(e.title)
			});
			
			var substanceId = this.currentSubstance.term_id
			
			 var material_terms = []
			 var values = [] // array for storing values
			 var sum = []
			 
			 for(var i = 0; i < this.currentSubstance.materials.length; i++){
				 material_terms.push(this.currentSubstance.materials[i].term_id)
					values[i] = []
					sum[i] = []
			 }

			// data for current substace and time interval						
			
			this.analyzesList.forEach(function(e){
				var s = appFunc.getAnalyzeSubstanceById(e, substanceId)	
				if(s){
					material_terms.forEach(function(m, i){
						let val = appFunc.getSubstanceMaterialValueById(s, m)
						
						
						if(val){
							sum[i].push(parseInt(val))
							values[i].push(val)
						}else{
							values[i].push( null) 
						}
					})
				}else{
					for(var i = 0; i < material_terms.length; i++){
						values[i].push( null) 
					}
				}
			});
			
			
			// searching target, warning and alerting limits
			var limits = [];
			for(var i = 0; i < material_terms.length; i++){
				limits[i] = this.currentSubstance.materials[i];
			}
			
			
			// assambling
			var result = [];
			
			var N = labels.length;
			
			for(var i = 0; i < material_terms.length; i++){
				
				var sd = 0
				var md = 0
				
				if(sum[i].length){
					var sd = this.standardDeviation(sum[i]);
					var md = this.average(sum[i]);
				}
				
				var CV = '';
				if(md){
					 CV = (sd/md).toFixed(2);	
				}			
				
				var unitMeasureName = appFunc.getMeasurUnitNameById(this.measureUnitsList, this.currentSubstance.measure_unit);
				

				
				var key = Math.round(Math.random() * 10000000);
				
				result[i] = {
						labels: labels, 
						values: values[i], 
						key: key, 
						md: md.toFixed(2) + ' ' + unitMeasureName,
						CV: CV,
						N: N,
						
						limits: limits[i]
				}
			}
			
			return result;
		}
	},
	
	watch: {
		'analyzesList': function(){
		},
		
		'currentSubstance': function(){

		}
		
	},

	mounted: function(){
		flatpickr("#startdate",{
			"locale": "ro",
			defaultDate: this.startDate,
			maxDate: new Date(),
			
			onChange: function(selectedDates, dateStr, instance) {
				let event = new CustomEvent('startDateChanged',  {detail:{
					selectedDates: selectedDates,
					dateStr: dateStr
		        }});
				instance.element.dispatchEvent(event);
			}
		});
		flatpickr("#enddate", {
			"locale": "ro",
			defaultDate: this.endDate,
			maxDate: new Date(),
			
			onChange: function(selectedDates, dateStr, instance) {
				let event = new CustomEvent('endDateChanged',  {detail:{
					selectedDates: selectedDates,
					dateStr: dateStr
		        }});
				instance.element.dispatchEvent(event);
			}
		});
		
		
	},
	
	

	template: `
	<div>
	<div class="row"  v-if="forPrint">
	<div class="col-sm-1">&nbsp;</div><div class="col-sm-10 text-center"><h4>{{ currentSubstance.name }} {{ moment(startDate).format("DD-MM-YYYY")  }} - {{  moment(endDate).format("DD-MM-YYYY") }}</h4></div><div class="col-sm-1"><button type="button" class="btn btn-primary no-print" @click="window.print()">Tipărește</button></div>
	</div>
	<form class="form-inline" v-if="!forPrint">
		Intre data <input id="startdate" class="form-control" @startDateChanged="onDateChange" type="text" placeholder="Select Start Date..">
		si <input id="enddate" class="form-control" @endDateChanged="onDateChange" type="text" placeholder="Select End Date..">
	</form>
	
	<div v-for="(item, index) in graphicsData" :key="item.key">
		<analyzes-graphic :data="item"></analyzes-graphic>
	</div>
	
	
	</div>
	`
});


//=============================================================
//analyzes graphic component
//=============================================================
Vue.component('analyzes-graphic', {
	props: ['data'],

	        methods: {
	        	// return an array with the same length as modelArr filled with null except the first and last element which will have lineValue values 
	        	getLimitsValues(modelArr, lineValue){
	        		 var arr = Array.apply(null, Array(modelArr.length))
	        		 arr.splice(0, 1, lineValue)
	        		 arr.splice(-1, 1, lineValue)
	        		 return arr
	        	},   	

	        	
	    		drawChart(){
	    			var ctx = document.getElementById("analyze_chart_"+this.data.key);
	    			
	    			var datasets = [{
			        	fill: false,
			        	pointStyle: 'rect',
			            lineTension: 0.1,
			            backgroundColor: "rgba(0,192,239,0.4)",
			            borderColor: "rgba(0,192,239,1)",
			            spanGaps: true,
			            
			            data: this.data.values,
			        }]
	    			
	    			
	    			// check for target value
	    			if(this.data.limits.target_val){
	    				var target_val = this.data.limits.target_val;
	    				var targetVals = this.getLimitsValues(this.data.values, target_val)
	    				
	    				datasets.push(this.getDrawLineObject(targetVals, "rgba(0,166,90,1)", "rgba(0,166,90,0.4)") );
	    			}
	    			
	    			// check warning values
	    			if(this.data.limits.target_val && this.data.limits.warning_val){
	    				
	    				var warningBorderColor = "rgba(243,156,18,1)";
	    				var warningBackgroundColor = "rgba(243,156,18,0.4)";	    				

	    				var low_warning = parseInt(this.data.limits.target_val) - parseInt(this.data.limits.warning_val);
	    				var hi_warning = parseInt(this.data.limits.target_val) + parseInt(this.data.limits.warning_val);
	    				
	    				var low_warning_arr = this.getLimitsValues(this.data.values, low_warning)
	    				
	    				var hi_warning_arr = this.getLimitsValues(this.data.values, hi_warning)
	  
	    				
	    				datasets.push(this.getDrawLineObject(low_warning_arr, warningBorderColor, warningBackgroundColor) );
	    				datasets.push(this.getDrawLineObject(hi_warning_arr, warningBorderColor, warningBackgroundColor) );
	    			}
	    			
	    			// check alert values
	    			if(this.data.limits.target_val && this.data.limits.alert_val){
	    				
	    				var alertBorderColor = "rgba(221,75,57,1)";
	    				var alertBackgroundColor = "rgba(221,75,57,0.4)";	    				

	    				var low_alert = parseInt(this.data.limits.target_val) - parseInt(this.data.limits.alert_val);
	    				var hi_alert = parseInt(this.data.limits.target_val) + parseInt(this.data.limits.alert_val);
	    				
	    				var low_alert_arr = this.getLimitsValues(this.data.values, low_alert)
	    				
	    				var hi_alert_arr = this.getLimitsValues(this.data.values, hi_alert)
	    				
	    				datasets.push(this.getDrawLineObject(hi_alert_arr, alertBorderColor, alertBackgroundColor) );
	    				datasets.push(this.getDrawLineObject(low_alert_arr, alertBorderColor, alertBackgroundColor) );
	    			}
	    			
	    			
	    			var myChart = new Chart.Line(ctx, {
	    			    type: 'line',
	    			    data: {
	    			        labels: this.shortedLabels,	    			        
	    			        datasets: datasets
	    			    },
	    			    options: {
				            legend: {
				                display: false,
				            },
	    			        scales: {
	    			        	xAxes: [{
	    			                display: true
	    			            }],
	    			            yAxes: [{
	    			                ticks: {
	    			                    beginAtZero:false
	    			                }
	    			            }]
	    			        }
	    			    }
	    			   
	    			});
	    			
	    			var days = this.data.labels
	    			
		        	document.getElementById("analyze_chart_"+this.data.key).onclick = function(evt){
		                var activePoints = myChart.getElementsAtEvent(evt);
		                var firstPoint = activePoints[0];
		                if(firstPoint){
			                var day = days[firstPoint._index];
			                bus.$emit('editedItemDateChanged', day)
		                }
		            }	    			
	    		},
	    		
	    		
	    		getDrawLineObject(values, borderColor, bgColor){
	    			return {
    					fill: false,
						lineTension: 0.1,
			            borderWidth: 2,
			            pointRadius: 0,
			            spanGaps: true,
			            backgroundColor: bgColor,
			            borderColor: borderColor,
			            data:values,

	    			}
	    		}
	        },
	        
	        computed: {
	        	shortedLabels(){
	        		return this.data.labels.map(e => moment(e).format('DD-MMM'))
	        	}
	        },
	        
	        mounted: function(){
	        	this.drawChart();
	        },
	        
	        template: `
	        <div>
	        	<div class="row"><div class="col-sm-12 text-center"><strong>{{ data.materialName }} m = {{ data.md }}  &nbsp; &nbsp; CV =  {{ data.CV }}   &nbsp; &nbsp;   N = {{ data.N }}</div></strong></div>
	        	<canvas :id="'analyze_chart_'+data.key" width="500" height="200"  ></canvas>
	        </div>`
});


//=============================================================
// print-graphics component
//=============================================================
Vue.component('print-graphics', {
props: ['measureUnitsList', 
    'substancesList',
    'materialsList',
    'currentSubstance',
    'analyzesList',
    'startDate',
    'endDate'
    ],
    
    template: `
    <div class="container">
		<div class="row">
			<div class="col-sm-12">
				<analyzes-graphic-container 
				:substances-list="substancesList" 
				:measure-units-list="measureUnitsList"
				:analyzes-list = "analyzesList"
				:current-substance="currentSubstance"
				:start-date="startDate"
				:end-date="endDate"
				:for-print="true"
				></analyzes-graphic-container>
			</div>
		</div>
	</div>
    `
    
});

//=============================================================
// print-table component
//=============================================================
Vue.component('print-table', {
props: ['measureUnitsList', 
 'substancesList',
 'materialsList',
 'currentSubstance',
 'analyzesList',
 'startDate',
 'endDate'
 ],
 
 methods: {
	 
 },
 
 computed: {
	 tableData: function(){
		 var records = [];
		 
		 var material_terms = [];
		 
		 this.currentSubstance.materials.forEach(function(e){
			 material_terms.push(e.term_id);
		 });
		 
		 var substTermId = this.currentSubstance.term_id;
		 
		 this.analyzesList.forEach(function(e){
			
			var s = appFunc.getAnalyzeSubstanceById(e, substTermId);
			
			if(s){
				var item = {title: e.title, register_time: s.register_time, values: []}
				material_terms.forEach(function(m, i){
					item.values[i] = appFunc.getSubstanceMaterialValueById(s, m);
				})
				records.push(item);
			}
		 });
		 
		 return records;
	 },
	 
	 
 },
 
 template: `
 <div class="container">
		<div class="row">
		<div class="col-sm-1">&nbsp;</div><div class="col-sm-10 text-center"><h4>Monitorizare {{ currentSubstance.name }}  {{ moment(startDate).format("DD-MM-YYYY") }} - {{ moment(endDate).format("DD-MM-YYYY") }}</h4></div><div class="col-sm-1"><button type="button" class="btn btn-primary no-print" @click="window.print()">Tipărește</button></div>
			<div class="col-sm-12">				
				<table class="table">
				<thead>
				<tr><th>Data Ora</th><th v-for="mat in currentSubstance.materials">{{ appFunc.getMaterialNameById(materialsList, mat.term_id) }} </th></tr>
				</thead>
				<tbody>
				<tr v-for="r in tableData"><td>{{ moment(r.title).format("DD-MM-YYYY") }} {{ r.register_time }}</td><td v-for="val in r.values">{{ val }}</td></tr>
				</tbody>
				</table>
			</div>
		</div>
	</div>
 `
 
});

// =============================================================
// 								App
// =============================================================


var amApp = new Vue({
	el: "#app",
	data: {
		currentView: 'pre-loading',
		currentSubstance: null,
		editedAnalyze: {},
		
		substancesList: [],		
		materialsList: [],
		measureUnitsList: [],
		
		analyzesList:[],
		
		
		startDate:moment().subtract(30, 'days').format('YYYY-MM-DD'),
		endDate:moment().format('YYYY-MM-DD')
	},
	
	methods: {		
		addItem: function(){
			this.substancesList.push({ name: 'KKK' })
		},
		
		setupSubstancesList: function(arr){
			this.substancesList = arr;

			if(this.substancesList[0]){
				this.setupCurrentSubstance(this.substancesList[0]);
			}else{
				this.currentSubstance = null;
			}
		},
		
		setupCurrentSubstance(sub){
			this.currentSubstance = sub;
		},
		
		setupMeasureUnitsList: function(arr){
			this.measureUnitsList = arr;
		},
		
		setupAnalyzesList: function(arr){
			this.analyzesList = arr;
		},
		
		setupMaterialsList(arr){
			this.materialsList = arr;
		},
		
		setEditedAnalyze(data){
			this.editedAnalyze = data;
		},		
		
		getAnalyzeFromList(title){
			return this.analyzesList.find(e => e.title == title)
		},
		
		updateCurrentSubstance(subst){
			
			var index = this.substancesList.findIndex( function (el ){
				return el.term_id == subst.term_id;
			});
			
			if(index != -1){
				this.substancesList.splice(index, 1, subst);
				this.currentSubstance = subst;
			}
		},
		
		
		// invoked once, on first load
		checkLoadingStatus(){
			if(this.substancesList.length && this.materialsList.length && this.measureUnitsList.length){
				this.currentView = 'analyzes-monitor';
				this.fetchAnalyzes();
			}
		},		
		
		fetchAnalyzes(){
			var days = this.getDaysInInterval(this.startDate, this.endDate);
			
			var action = 'fetch_analyzes';
			
			jQuery.post(
					ajax_obj.ajax_url, 
				    {
				        'action': action,
				        'data':   days
				    }, 
				    function(response){
				    	var r = JSON.parse(response)
				    	if(r.status == 'error'){
				    		alert("An error occured: " + r.msg);
				    		return;
				    	}else if(r.result){ 
				    		amApp.setupAnalyzesList(r.result);
				    	}
				    }
				);
			
		},	
		
		fetchEditedItem(title){
			var comp = this
			var action = 'get_analyze';
			jQuery.post(
					ajax_obj.ajax_url, 
				    {
				        'action': action,
				        'data':   title
				    }, 
				    function(response){
		
				    	var r = JSON.parse(response)
				    	if(r.status == 'error'){
				    		alert("Error: " + r.msg);
				    		return;
				    	} else if(r.result){ // if is an edit request		
				    		comp.setEditedAnalyze(r.result);			    		
				    	}
				    }
				);
		},
		
		onEditedItemDateChange(date){
			let analyze = this.getAnalyzeFromList(date)
			if(analyze){
	
				this.editedAnalyze = analyze
			}else{
				this.fetchEditedItem(date)
			}
		},
		
		
		onEndDateChange(date){
			this.endDate = date;
			this.fetchAnalyzes();
		},
		
		onStartDateChange(date){
			this.startDate = date;
			this.fetchAnalyzes();
		},
		
		onCurrentSubstanceChanged(sub){
			this.setupCurrentSubstance(sub);
		},
		
		onAnalyzeUpdated(analyze){
			var index = this.analyzesList.findIndex(function(a){				
				return analyze.title == a.title;
			});	
			
			if(index != -1){
				let cp = JSON.parse(JSON.stringify(analyze))
				this.analyzesList.splice(index, 1, cp);
			}
			
			this.editedAnalyze = analyze
		},
		
		getDaysInInterval(startDate, endDate){
		    var dateArray = [];
		    var currentDate = moment(startDate, 'YYYY-MM-DD');
		    var stopDate = moment(endDate, 'YYYY-MM-DD');
		    
		    if(stopDate < currentDate){
		    	var c = currentDate;
		    	currentDate = stopDate;
		    	stopDate = c;
		    }
		    while (currentDate <= stopDate) {
		        dateArray.push( moment(currentDate).format('YYYY-MM-DD') )
		        currentDate = moment(currentDate).add(1, 'days');
		       
		    }
		    return dateArray;
		},
		
		
		onSubstanceEdit(data){
			var action = data.action + '_substance_term';
			var item = data.item;
			
			jQuery.post(
					ajax_obj.ajax_url, 
				    {
				        'action': action,
				        'data':   item
				    }, 
				    function(response){

				    	var r = JSON.parse(response)
				    	if(r.status == 'error'){
				    		alert("Error: " + r.msg);
				    		return;
				    	} else if(r.result){ // if is an edit request			    		
				    		amApp.setupSubstancesList(r.result);			    		
				    	}			  
				    }
				);
		},
		
		onMaterialEdit(data){
			var action = data.action + '_material_term';
			var item = data.item;
			
			jQuery.post(
					ajax_obj.ajax_url, 
				    {
				        'action': action,
				        'data':   item
				    }, 
				    function(response){
				    	
				    	var r = JSON.parse(response)
				    	if(r.status == 'error'){
				    		alert("Error: " + r.msg);
				    		return;
				    	} else if(r.result){ // if is an edit request			    		
				    		amApp.setupMaterialsList(r.result);			    		
				    	}	
				    }
				);
		},
		
		onMeasureUnitEdit(data){
			var action = data.action + '_measure_unit_term';
			var item = data.item;
			
			jQuery.post(
					ajax_obj.ajax_url, 
				    {
				        'action': action,
				        'data':   item
				    }, 
				    function(response){
				    	var r = JSON.parse(response)
				    	if(r.status == 'error'){
				    		alert("Error: " + r.msg);
				    		return;
				    	} else if(r.result){ // if is an edit request			    		
				    		amApp.setupMeasureUnitsList(r.result);			    		
				    	}	
				    }
				);
		},
		
		
		onSubstanceLimitsEdit(data){
			var action = 'update_substance_limits';
			var item = data.item;
			
			jQuery.post(
					ajax_obj.ajax_url, 
				    {
				        'action': action,
				        'data':   item
				    }, 
				    function(response){
				    	var r = JSON.parse(response)
				    	if(r.status == 'error'){
				    		alert("Error: " + r.msg);
				    		return;
				    	} else if(r.result){ // if is an edit request	
				    		amApp.updateCurrentSubstance(r.result);			    		
				    	}			  
				    }
				);
		},
		
		onNavigate(view){
			this.currentView = view;
		},
		
		onLogout(){
			var action = 'do_logout';
			jQuery.post(
					ajax_obj.ajax_url, 
				    {
				        'action': action,
				        'data':   'foo'
				    }, 
				    function(response){
				    	window.location.href = '../signup';		  
				    }
				);
		}
	},
	
	mounted: function(){
		// load substances, materials and measure units 
		
		jQuery.post(
				ajax_obj.ajax_url, 
			    {
			        'action': 'fetch_substance_terms',
			        'data':   'foo'
			    }, 
			    function(response){
			    	var r = JSON.parse(response)
			    	if(r.status == 'error'){
			    		alert("Error: " + r.msg);
			    		return;
			    	} else if(r.result){ 
			    		amApp.setupSubstancesList(r.result);
			    		 amApp.checkLoadingStatus();
			    	}
			    }
			);
		
		jQuery.post(
				ajax_obj.ajax_url, 
			    {
			        'action': 'fetch_material_terms',
			        'data':   'foo'
			    }, 
			    function(response){
			    	
			    	var r = JSON.parse(response)
			    	if(r.status == 'error'){
			    		alert("Error: " + r.msg);
			    		return;
			    	} else if(r.result){
			    		amApp.setupMaterialsList(r.result);
			    		 amApp.checkLoadingStatus();
			    	}

			    }
			);
		
		jQuery.post(
				ajax_obj.ajax_url, 
			    {
			        'action': 'fetch_measure_unit_terms',
			        'data':   'foo'
			    }, 
			    function(response){
			    	
			    	var r = JSON.parse(response)
			    	if(r.status == 'error'){
			    		alert("Error: " + r.msg);
			    		return;
			    	} else if(r.result){ 
			    		amApp.setupMeasureUnitsList(r.result);
			    		 amApp.checkLoadingStatus();
			    	}
			    }
			);
		
		// load the current day analyze
		this.fetchEditedItem(moment().format('YYYY-MM-DD'))
		
		
	}

})


//=============================================================
//					Bus
//=============================================================


var bus = new Vue();

bus.$on('editedItemDateChanged', function(date){
	amApp.onEditedItemDateChange(date);
})

bus.$on('endDateChanged', function(date){
	amApp.onEndDateChange(date);
})

bus.$on('startDateChanged', function(date){
	amApp.onStartDateChange(date);
})

bus.$on('currentSubstanceChanged', function(item){
	amApp.onCurrentSubstanceChanged(item);
})

bus.$on('analyzeUpdated', function(item){
	amApp.onAnalyzeUpdated(item);
})

bus.$on('substanceLimitsEdit', function(item){
	amApp.onSubstanceLimitsEdit(item);
})

