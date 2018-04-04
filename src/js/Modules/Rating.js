Chicken.component('ui-rating', false, function() {

    //  ██████╗ ██████╗ ███╗   ██╗███████╗██╗ ██████╗ ██╗   ██╗██████╗  █████╗ ████████╗██╗ ██████╗ ███╗   ██╗
    // ██╔════╝██╔═══██╗████╗  ██║██╔════╝██║██╔════╝ ██║   ██║██╔══██╗██╔══██╗╚══██╔══╝██║██╔═══██╗████╗  ██║
    // ██║     ██║   ██║██╔██╗ ██║█████╗  ██║██║  ███╗██║   ██║██████╔╝███████║   ██║   ██║██║   ██║██╔██╗ ██║
    // ██║     ██║   ██║██║╚██╗██║██╔══╝  ██║██║   ██║██║   ██║██╔══██╗██╔══██║   ██║   ██║██║   ██║██║╚██╗██║
    // ╚██████╗╚██████╔╝██║ ╚████║██║     ██║╚██████╔╝╚██████╔╝██║  ██║██║  ██║   ██║   ██║╚██████╔╝██║ ╚████║
    //  ╚═════╝ ╚═════╝ ╚═╝  ╚═══╝╚═╝     ╚═╝ ╚═════╝  ╚═════╝ ╚═╝  ╚═╝╚═╝  ╚═╝   ╚═╝   ╚═╝ ╚═════╝ ╚═╝  ╚═══╝
    //                                                                                                        

    this.cssClass = 'ui rating';
    this.defaults({

        value: null,

        uiInitialRating: 0,
        uiFireOnInit: false,
        uiClearable: 'auto',
        uiInteractive: true,

        uiMaxRating: 5,

    });


    // ██████╗ ███████╗██╗  ██╗ █████╗ ██╗   ██╗██╗ ██████╗ ██╗   ██╗██████╗ 
    // ██╔══██╗██╔════╝██║  ██║██╔══██╗██║   ██║██║██╔═══██╗██║   ██║██╔══██╗
    // ██████╔╝█████╗  ███████║███████║██║   ██║██║██║   ██║██║   ██║██████╔╝
    // ██╔══██╗██╔══╝  ██╔══██║██╔══██║╚██╗ ██╔╝██║██║   ██║██║   ██║██╔══██╗
    // ██████╔╝███████╗██║  ██║██║  ██║ ╚████╔╝ ██║╚██████╔╝╚██████╔╝██║  ██║
    // ╚═════╝ ╚══════╝╚═╝  ╚═╝╚═╝  ╚═╝  ╚═══╝  ╚═╝ ╚═════╝  ╚═════╝ ╚═╝  ╚═╝
    //                                                                       

    this.when('ready', () => {

        // Prepare options
        let options = this.getAttributes('ui');
        
        // On rate
        options.onRate = (v) => {
            
            // Set value
            if (v !== this.get('value')) {
                this.set('value', v);
            }

        };
        
        // Create.
        this.$element.rating(options);
        
        // Observe value
        this.observe('value', () => {
            this.applyValue();
        });
        this.applyValue();

    });

}, {

    applyValue() {

        // Do we have a value?
        let newValue = this.get('value');
        if (newValue === undefined) newValue = 0;
        let oldValue = this.$element.rating('get rating');

        // Changed?
        if (oldValue === newValue) return;
    
        // Apply
        this.$element.rating('set rating', newValue);
    
    }



});