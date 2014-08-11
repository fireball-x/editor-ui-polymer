(function () {
    Polymer('fire-ui-button', {
        publish: {
            focused: {
                value: false,
                reflect: true
            },
        },

        ready: function () {
            this.$.focus.tabIndex = FIRE.getParentTabIndex(this)+1;
        },

        focusAction: function (event) {
            this.focused = true;
        },

        blurAction: function (event) {
            if ( this.focused === false )
                return;

            if ( FIRE.find( this.shadowRoot, event.relatedTarget ) )
                return;

            this.focused = false;
        },

        clickAction: function (event) {
            this.fire('click', event );
            this.$.focus.focus();
            event.stopPropagation();
        },
    });
})();
