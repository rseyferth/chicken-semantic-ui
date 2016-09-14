/** START TEMPLATES **/
Chicken.Dom.View.TemplateCache.set('semantic-ui:modules.checkbox', '<input type="checkbox" value={{value}} checked={{checked}}>\n<label>{{yield}} is {{checked}}</label>');
/** END TEMPLATES **/
Chicken.component('ui-button', false, function () {

	this.tagName = 'button';
	this.cssClass = 'ui button';

	this.dom.on('click', () => {

		this.sendAction();
	});
});
Chicken.component('ui-accordion', false, function () {

	this.tagName = 'div';
	this.cssClass = 'ui accordion';

	this.on('added', $el => {
		$el.accordion();
	});
});
Chicken.component('ui-checkbox', false, function () {

	this.tagName = 'div';
	this.cssClass = 'ui checkbox';

	this.on('added', $el => {

		$el.checkbox();
	});
});
Chicken.component('ui-progress', false, function () {

	this.tagName = 'div';
	this.cssClass = 'ui progress';

	this.on('added', $el => {

		$el.progress({
			value: this.get('value')
		});
	});

	this.observe('value', () => {

		this.$element.progress({
			value: this.get('value')
		});
	});
});