(function(dir){
	'use strict';


	function unitCreate(){
		return {
			restrict: 'AE',
			 templateUrl: '/views/unitCreate.html',
			scope: {
				unit: "="
			},
			controller: function($filter, $injector){
								var vm = this;

						        var template = $injector.get('TemplateService').template;
					          	var managerContainer = $injector.get('WizardContainerManager');
					          	var textCollectionManager = $injector.get('wTextCollectionManager');

					          	vm.setColor = setColor;
							},
			link: function(scope, element, attrs, controller){
			  	function componentToHex(c) {
		            var hex = c.toString(16);
		            return hex.length == 1 ? "0" + hex : hex;
		        }

			  	element.spectrum({
			  		clickoutFiresChange: true,
			  		hideAfterPaletteSelect:true,
				    showPaletteOnly: true,
				    togglePaletteOnly: true,	
				    togglePaletteMoreText: 'more',
				    togglePaletteLessText: 'basic',			    		    
				    // palette: [
				    //     ["#f00","#f90","#ff0","#0f0","#0ff","#00f","#90f","#f0f"],
				    //     ["#900","#b45f06","#bf9000","#38761d","#134f5c","#0b5394","#351c75","#741b47"]
				    // ],   
				    showButtons: false,	
				    allowEmpty: true,
				    color: "",		
				    change: function(color) {

						if (color != null){
				            var r = parseInt(color['_r']);
				            var g = parseInt(color['_g']);
				            var b = parseInt(color['_b']);						

							scope.item.color = "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);
		
							//scope.item.color = color.toHexString();		
							$(this).parent().prev().attr('value', scope.item.color);

							var flagValue = $(this).parent().prev().attr("flag");

							if (flagValue){
								ChangeColor(scope.item, controller.setColor, "", flagValue);
							} else ChangeColor(scope.item, controller.setColor);

						}


					},
					show: function(color) {

						var palette =$('div.palette').attr('pal');
						//var defualtColorsRow;
	                	var palArray = [["#f40","#f90","#fc3","#7f0","#0df","#08f","#90f","#65f","#de4"]];
                		var araryRow = [];
	                	var rowCounter = 1;

	                	if (palette != "") {
							var imageObject = new Image();
							var defualtColorsRow = palArray.pop(); 

		                	imageObject.src = palette;

		                	var colorThief = new ColorThief();
		                	var imagePalette = colorThief.getPalette(imageObject, 37); 

		                	imagePalette.forEach(function(color){
		                		var palColor = 'rgb(' + color[0] + ',' + color[1] + ',' + color[2] + ')';

		                		//araryRow.push(palColor);
		                		if (rowCounter%9 != 0) {
		                			araryRow.push(palColor);
		                		} else {
		                			araryRow.push(palColor);	
									palArray.push(araryRow);
		                			araryRow = [];
		                		}
								rowCounter++;
                		
		                	});
							palArray.push(araryRow); 
							palArray.push(defualtColorsRow);               	
						}

	                	element.spectrum("option", "palette", palArray);					
	                }
				});		
				// element.bind("blur", function(){
				// 	element.spectrum("hide");
				// });	
			}
		};
	};	

  	dir.directive('jwUnitCreate', unitCreate);

})(angular.module('jwUnit.Directive',[]));