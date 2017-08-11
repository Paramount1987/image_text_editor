document.addEventListener("DOMContentLoaded", ready);

var makerTemplate = '<div class="maker-module"><div class="maker-module__header"><span class="maker-module__close-toggle"></span><button type="button" class="maker-module__remove">x</button><div class="maker-module__header-title">Text</div></div><div class="maker-module__body"><div class="maker-module__row"><textarea class="text-input" id="textText1" rows="3" maxlength="50">Example copy</textarea></div><div class="maker-module__row"><label for="text-style">Style</label><select name="text-style" id="text-style" class="maker-module__select text-style"><option value="Arial">Arial</option><option value="PFAgoraSansPro">Agora Sans Pro</option><option value="Helvetica Neue">Helvetica Neue</option></select></div><div class="maker-module__row"><label for="text-color">Color</label><input type="color" name="text-color" id="text-color" class="text-color" value="#ffffff"></div><div class="maker-module__row"><label for="text-size">Size</label><select name="text-size" id="text-size" class="maker-module__select text-size"><option value="auto">auto</option><option value="70">70</option><option value="100">100</option></select></div></div></div>';

var fabricCanvas = {
	$makerWrapper: $('.maker-module__wrap'),
	canvas: null,
	image: null,
	texts: {},
	textsCount: 0,
	sizeScale: null,

	init: function (img) {
		this.canvas = new fabric.Canvas('fabric', { preserveObjectStacking:true });
		this.loadImage(img);
		this.scaleEvent();
		this.rotateEvent();
		this.fabricText();
		this.addFormFabricText();
		this.removeFormFabricText();
		this.toggleFormFabricText();
	},

	loadImage: function (img) {
		var self = this;
		var imgObj = new Image();
		imgObj.src = img;
		imgObj.onload = function () {

			self.settingImageScale(imgObj);

			self.image = new fabric.Image(imgObj);
			self.image.set({
				left: 0,
				top: 0,
				width: imgObj.width,
				height: imgObj.height,
				hasControls: false,
			});

			self.canvas.add(self.image.scale(self.sizeScale));
			self.image.center().setCoords();
			self.canvas.sendToBack(self.image);
		}
	},

	settingImageScale: function (img) {
		var size = 520;
		var sizeImg = img.height > img.width ? img.width : img.height;
		this.sizeScale = size/sizeImg;
	},

	scaleImage: function (scale) {
		var computeScale = this.sizeScale + scale;
		this.image.scale(computeScale).center().setCoords();
	},

	rotateImage: function (angle) {
		this.image.setAngle(angle);
	},

	scaleEvent: function () {
		var self = this;

		$( "#slider-scale" ).slider({
			range: "min",
			min: 0,
			max: 2,
			step: 0.1,
			value: 0,
			slide: function( event, ui ) {
				self.scaleImage(ui.value);
				self.canvas.renderAll();
			}
		});
	},

	rotateEvent: function () {
		var self = this;

		$( "#slider-rotate" ).slider({
			orientation: "vertical",
			range: "min",
			min: -180,
			max: 180,
			value: 0,
			slide: function( event, ui ) {
				self.rotateImage(ui.value);
				self.canvas.renderAll();
			}
		});
	},

	fabricText: function () {
		var self = this;
		var $textInput = $(".text-input");

		var text = new fabric.Text($textInput.val(),{
			left: 10,
			top: 10,
			fill: '#fff',
			fontSize: 50,
			fontFamily: 'Helvetica Neue'
		});
		self.texts[self.textsCount++] = text;
		self.canvas.add(text);

		self.$makerWrapper.on( "keyup", ".text-input", function(e) {
			var currentText = $(this).closest(".maker-module").data("text");
			self.texts[currentText].text = e.target.value;
			self.canvas.renderAll();
		});

		self.$makerWrapper.on("change", ".text-size", function(e) {
			var currentText = $(this).closest(".maker-module").data("text");
			self.texts[currentText].fontSize = e.target.value === 'auto' ? 20 : e.target.value;
			self.canvas.renderAll();
		});

		self.$makerWrapper.on("change", ".text-style",function(e) {
			var currentText = $(this).closest(".maker-module").data("text");
			self.texts[currentText].fontFamily = e.target.value;
			self.canvas.renderAll();
		});

		self.$makerWrapper.on("change", ".text-color",function(e) {
			var currentText = $(this).closest(".maker-module").data("text");
			self.texts[currentText].set({fill: e.target.value});
			self.canvas.renderAll();
		});
	},

	addFabricText: function () {
		var self = this;
		var el = ($(".maker-module").last());
		$(el).attr("data-text", self.textsCount);
		var textInput = $(el).find('.text-input').val();

		var text = new fabric.Text(textInput,{
			left: 10,
			top: 10,
			fill: '#fff',
			fontSize: 50,
			fontFamily: 'Helvetica Neue'
		});
		self.texts[self.textsCount++] = text;
		self.canvas.add(text);
	},

	removeFabricText: function (item) {
		this.canvas.remove(this.texts[item]);
	},

	addFormFabricText: function () {
		var self = this;
		var $btnMaker = $(".js-more-btn");

		$btnMaker.click(function() {
			self.$makerWrapper.append(makerTemplate);
			self.addFabricText();
		});
	},

	removeFormFabricText: function () {
		var self = this;

		self.$makerWrapper.on("click", ".maker-module__remove", function(e) {
			e.stopPropagation();
			if ($(".maker-module").length === 1) {
				return;
			}

			var $makerModule =  $(this).closest(".maker-module");
			var textCounter =  $makerModule.data("text");

			$makerModule.remove();
			self.removeFabricText(textCounter);
		});
	},

	toggleFormFabricText: function () {
		var self = this;

		self.$makerWrapper.on("click", ".maker-module__header", function(e) {
			$(this).toggleClass("closed");
			$(this).next().slideToggle();
		});
	}
}

function ready (){
	fabricCanvas.init('./images/croppie_sample.jpg');
}