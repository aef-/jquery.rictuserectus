/* jquery.rictuserectus v.0.2.1
 * A nice and tidy tag manager.
 * by aef
 */
( function( $, window, document, undefined ) {
  var pluginName = "rictuserectus",
      name = "plugin_rictuserectus",
      defaults = { 
      },
      methods = [ "show" ],
      methodsWithReturn = [ ];

  function RictusErectus( $element, options ) {
    this.options = $.extend( {}, defaults, options );

    this.origBodyOverflow;
    this.resizeTimeout;

    this.template = '<div class="re-container">' +
                      '<div class="re-mask">' +
                        '<div class="re-close-icon"></div>' + 
                        '<div class="re-resource-container">' +
                        '</div>' +
                      '</div>' +
                    '</div>';

    this.$element = $element.clone( ).addClass( "re-resource" );
    this.$body = $( "body" );
    this.$window = $( window );
    this.windowHeight = this.$window.height( );
    this.windowWidth = this.$window.width( );
    this.$container = $( this.template );
    this.$resourceContainer = this.$container.find( ".re-resource-container" );
    if( Hammer ) {
      this.hammer = new Hammer( this.$container[ 0 ], { } );
    }

    this.setup( );
  }

  RictusErectus.prototype.removeEvents = function( ) {
    this.$container.off( "mousemove" );
  };

  RictusErectus.prototype.addEvents = function( ) {
    //this.$container.on( "mousemove", $.proxy( this.onMouseMove, this ) );
    this.$container.on( "click", $.proxy( this.hide, this ) );
    if( this.hammer ) {
      this.hammer.on( "pan", $.proxy( this.scrollImage, this ) );
    }
  };

  RictusErectus.prototype.onMouseMove = function( e ) {
    this.scrollImage( e );
  };

  RictusErectus.prototype.scrollImage = function( e ) {
    var mouseX, mouseY;

    if( e.type === "pan" ) {
      mouseX = e.center.x;
      mouseY = e.center.y;
    }
    else {
      mouseX = e.pageX;
      mouseY = e.pageY;
    }

    var windowWidth = this.$container.width( ),
        windowHeight = this.$container.height( ),
        elementWidth = this.$element.innerWidth( ),
        elementHeight= this.$element.innerHeight( ),
        cssObj = { },
        precentageMoveX, percentageMoveY;

    if( windowWidth < elementWidth ) {
      percentageMoveX = 1 - ( windowWidth - mouseX ) / windowWidth;
      cssObj.left = percentageMoveX * ( windowWidth - elementWidth );
    }
    if( windowHeight < elementHeight ) {
      percentageMoveY = 1 - ( windowHeight - mouseY ) / windowHeight;
      cssObj.top = percentageMoveY * ( windowHeight - elementHeight );
    }

    this.$resourceContainer.css( cssObj );
  };

  RictusErectus.prototype.show = function( ) {
    var img;
    if( this.$element.data( "large-image" ) || this.$element[ 0 ].tagName === "IMG" ) {
      img = new Image( );
      img.onload = $.proxy( this.showElement, this );
      img.src = this.$element.data( "large-image" ) || this.$element.attr( "src" );
    }
    else {
      this.showElement( ); 
    }

  };

  RictusErectus.prototype.showElement = function( ) {
    this.origBodyOverflow = this.$body.css( "overflow" );
    this.$body.css( "overflow", "hidden" );
    this.$element.appendTo( this.$resourceContainer );
    this.$container.css( 'opacity', 0 );
    this.$container.appendTo( this.$body );
    this.$resourceContainer.css( { 
      top: this.$container.height( ) / 2 - this.$element.innerHeight( ) / 2 ,
      left: this.$container.width( ) / 2 - this.$element.innerWidth( ) / 2 
    } );
    this.$container.animate( { opacity: 1 } );
  };

  RictusErectus.prototype.hide = function( ) {
    this.$body.css( "overflow", this.origBodyOverflow );
    this.removeEvents( );
    this.$container.fadeOut( function( ) { this.remove( ) } );
  };

  RictusErectus.prototype.destroy = function( ) {
    this.hide( );
  };

  RictusErectus.prototype.setup = function( ) {
    this.addEvents( );
  };

  $.fn[ pluginName ] = function( optionsOrMethod ) {
    var $this,
        _arguments = Array.prototype.slice.call( arguments ),
        optionsOrMethod = optionsOrMethod || { },
        results = [ ], returningData = false, selectors;

    selectors = this.each(function ( ) {
      $this = $( this );
      if( !$this.data( name ) && ( typeof optionsOrMethod ).toLowerCase( ) === "object" ) 
        $this.data( name, new RictusErectus( $this, optionsOrMethod ) );
      else if( ( typeof optionsOrMethod ).toLowerCase( ) === "string" ) {
        if( ~$.inArray( optionsOrMethod, methods ) )
          $this.data( name )[ optionsOrMethod ].apply( $this.data( name ), _arguments.slice( 1, _arguments.length ) );
        else if( ~$.inArray( optionsOrMethod, methodsWithReturn ) ) {
          returningData = true;
          results.push( $this.data( name )[ optionsOrMethod ].apply( $this.data( name ), _arguments.slice( 1, _arguments.length ) ) );
        }
        else
          throw new Error( "Method " + optionsOrMethod + " does not exist. Did you instantiate rictuserectus?" );
      }
    } );

    return returningData ? results : selectors;
  };
} )( jQuery, window, document );
