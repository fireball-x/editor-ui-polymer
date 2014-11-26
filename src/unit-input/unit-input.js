(function () {
    Polymer(EditorUI.mixin({
        publish: {
            value: null,
            unit: '',
            type: 'int', // int, float
            precision: 2,
            interval: null,
            min: null,
            max: null,
        },

        ready: function() {
            this._init(this.$.input);

            switch ( this.type ) {
                case 'int':
                    this._min = (this.min!==null) ? parseInt(this.min) : Number.NEGATIVE_INFINITY;
                    this._max = (this.max!==null) ? parseInt(this.max) : Number.POSITIVE_INFINITY;
                    this._interval = (this.interval!==null) ? this.interval : 1;
                    break;

                case 'float':
                    this._min = (this.min!==null) ? parseFloat(this.min) : -Number.MAX_VALUE;
                    this._max = (this.max!==null) ? parseFloat(this.max) : Number.MAX_VALUE;
                    this._interval = (this.interval!==null) ? this.interval : 1/Math.pow(10,this.precision);
                    break;
            }
        },

        _convert: function ( val ) {
            switch ( this.type ) {
                case 'int':
                    val = parseInt(val);
                    if ( isNaN(val) )
                        val = 0;
                    val = Math.min( Math.max( val, this._min ), this._max );
                    return val;

                case 'float':
                    val = parseFloat(parseFloat(val).toFixed(this.precision));
                    if ( isNaN(val) )
                        val = 0;
                    val = Math.min( Math.max( val, this._min ), this._max );
                    return val;
            }

            Fire.log("can't find proper type for " + this.type);
            return val;
        },

        valueChanged: function () {
            this.$.input.value = this._convert(this.value);
        },

        focusAction: function (event) {
            this._focusAction();
            this.lastVal = this._convert(this.value);
        },

        blurAction: function (event, detail, sender) {
            if ( this.focused === false )
                return;

            if ( EditorUI.find( this.shadowRoot, event.relatedTarget ) )
                return;

            this._blurAction();

            var val = this._convert(this.$.input.value);
            if ( this.value !== val ) {
                this.value = val;
                this.fire('changed');
            }
            // NOTE: we set the input.value because this.value may not changed after invalid inputs
            this.$.input.value = val;

            this.fire('confirm');
        },

        inputAction: function (event) {
            if ( event.target.value === "-" ) {
                return;
            }
            if ( event.target.value === "." ) {
                event.target.value = "0.";
                return;
            }
            if ( event.target.value === "-." ) {
                event.target.value = "-0.";
                return;
            }

            var val = this._convert(event.target.value);
            if ( this.value !== val ) {
                this.value = val;
                this.fire('changed');
            }

            event.stopPropagation();
        },

        inputKeyDownAction: function (event) {
            switch ( event.which ) {
                // enter
                case 13:
                    this.$.input.blur();
                break;

                // esc
                case 27:
                    // NOTE: we set the input.value because value depends on _convert(input.value)
                    this.$.input.value = this.lastVal;
                    if ( this.value !== this.lastVal ) {
                        this.value = this.lastVal;
                        this.fire('changed');
                    }
                    this.$.input.blur();
                break;
            }
            event.stopPropagation();
        },

        unitClickAction: function (event) {
            this.$.input.focus();
            event.stopPropagation();
        },

        increaseAction: function (event) {
            var val = this._convert(this.value+this._interval);
            if ( this.value != val ) {
                this.value = val;
                this.fire('changed');
            }
            this.$.input.focus();
            event.stopPropagation();
        },

        decreaseAction: function (event) {
            var val = this._convert(this.value-this._interval);
            if ( this.value != val ) {
                this.value = val;
                this.fire('changed');
            }
            this.$.input.focus();
            event.stopPropagation();
        },
    }, EditorUI.focusable));
})();
