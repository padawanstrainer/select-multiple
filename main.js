/*!
 * SelectMutiple <https://github.com/padawanstrainer/select-multiple>
 * Versión 1.0 - Dec. 2024
 *
 * Author Germán Rodríguez - @PadawansTrainer.
 * Released under the MIT License.
 */

export class SelectMutiple extends HTMLElement{
    static formAssociated = true;
    static observedAttributes = ['value', 'disabled'];

    value = '';
    tag_name = 'radio';
    selected_value = null;
    nodes = [];
    options = [];
    items = [];
    items_name = 'items';
    items_lengths = [];

    constructor( ){
        super( );
        this.attachShadow({mode:"open"});
        this.internals = this.attachInternals( );
    }

    connectedCallback( ){
        this.getAttributes( );
        this.setName( );
        this.render( );
        this.addListeners( );
        this.setComboMaxWidth( );
        this.setSelectedOption( );
        this.setComboDefaultWidth( );
    }


    attributeChangedCallback( name, oldValue, newValue ){
        if( name == 'value' && newValue.trim( ) === '' ) return;

        const isMultiple = this.attributes.multiple != undefined;
        if( name == 'value' && isMultiple ){ this.updateValues( newValue, oldValue ); }

        if( name == 'disabled' ){
            if( newValue == '' ){
                this.classList.add('disabled');
                this.is_disabled = true;
            }
            else{
                this.classList.remove('disabled');
                this.is_disabled = false;
            }
        }
    }
    
    updateValues( newValue, oldValue ){
        if( newValue.trim( ) === '' ) return;
        if( newValue == oldValue ) return;

        const values = newValue.split(",");
        const checkboxes = this.shadowRoot.querySelectorAll( `input[type=${this.tag_name}]` );
        Array.from(checkboxes).forEach( cb => {
            cb.checked = values.includes( cb.value ); 
        });
    }

    get disabled() {
        return this.hasAttribute('disabled');
    }
    

    set disabled(value) {
        if (value) { this.setAttribute('disabled', ''); }
        else { this.removeAttribute('disabled'); }
    }
    
    setComboMaxWidth( ){
        const span = this.shadowRoot.querySelector('.combo-header span');
        const span_width = span.getBoundingClientRect().width; 

        this.style.setProperty('--max-width', ( Math.floor(span_width) - 4 ) + 'px' );
        span.innerHTML = this.label;
    }

    setComboDefaultWidth( ){
        const inlineWidth = !! this.style.width;
        const hasWidth = Array.from(document.styleSheets)
        .some(hoja => {
          try {
            // Convertir las reglas de CSS en un array para poder buscar
            const reglas = Array.from(hoja.cssRules || hoja.rules || []);
            return reglas.some(regla => {
              // Verificar si la regla selector coincide con el elemento
              if (regla.type === CSSRule.STYLE_RULE) {
                // Comprobamos si el selector coincide con nuestro elemento y tiene width
                return this.matches(regla.selectorText) && 
                       regla.style.getPropertyValue('width') !== '';
              }
              return false;
            });
          } catch (e) {
            // Manejar posibles errores de acceso a reglas de hojas de estilo cruzadas
            return false;
          }
        });
  
      // Si no se ha definido un width, establecer el valor por defecto
      const combo_header = this.shadowRoot.querySelector('.combo-header'); 
      if (!hasWidth && !inlineWidth) {
        const combo_body = this.shadowRoot.querySelector('.combo-body'); 
        
        this.classList.add('visible');
        combo_header.style.width = (Math.max( combo_body.clientWidth, this.clientWidth ) + 10) + 'px';
        this.classList.remove('visible');
      }else{
        const width = parseFloat( getComputedStyle(this).width ) + 'px';
        combo_header.style.width = `calc( ${width} - var(--combo_padding_right___) - var(--combo_padding_left___) )`;
      }
    }

    isChecked( option, value_attr ){
        if( option.selected ) return true;
        if( this.is_multiple && value_attr ){
            const values = value_attr.split(",");
            return values.includes( option.value );
        }else{
            return value_attr == option.value;
        }

        return false;
    }

    getRand( ){
        return Math.round( Math.random( ) * 999999 ) + 100000;
    }

    getValueAttribute( ){
        if( this.attributes.value != undefined ){
            this.selected_value = this.attributes.value.value;
            return this.attributes.value.value;
        }
        return null;
    }

    getAttributes( ){ 
        this.is_multiple = this.attributes.multiple != undefined;
        this.is_disabled = this.attributes.disabled != undefined;
        this.show_value = this.dataset.value != undefined;
        this.show_search = this.dataset.search != undefined;
        this.show_null = this.dataset.null != undefined;
        this.max_value_width = this.dataset.valueWidth ?? null;
        
        this.search_label = this.dataset.search ?? '';
        this.null_label = this.dataset.null ?? 'Seleccione opción';
        this.null_value = this.dataset.nullValue ?? this.dataset.null ?? null;
        this.name = this.attributes.name ? this.attributes.name.value : null;
        this.label = this.attributes.label ? 
                        this.attributes.label.value :
                        this.options[0]?.innerHTML ?? 'Seleccione opción';
        if( this.is_multiple ) this.tag_name = 'checkbox';
    }

    getItems( ){
        return Array.from( this.shadowRoot.querySelectorAll( `input[type=${this.tag_name}]` ) );
    }

    getOptions( ){
        let fragment = '';
        const value_attr = this.getValueAttribute( );
        const parser = new DOMParser( );
        const htmlFragment = parser.parseFromString(this.innerHTML, 'text/html');

        this.options = htmlFragment.querySelectorAll('option');
        this.options.forEach( (option,idx) => {
            const id = `cb_${this.sanitizeString(this.items_name)}_${idx}_${this.getRand( )}`;
            const value = option.value || option.innerText;
            const checked = this.isChecked( option, value_attr ) ? 'checked': '';
            const prepend = this.show_value && option.value !== '' ? `<span class='display-value'>${option.value}</span> ` : '';
    
            fragment += `<div>
                <input type='${this.tag_name}' id='${id}' value='${value}' name='${this.items_name}' ${checked} data-text="${option.innerText}" />
                <label for='${id}'>${prepend}<span>${ option.innerHTML }</span></label>
            </div>`; 
            this.items_lengths.push(value.length);
        } );

        return fragment; 
    }

    setValue( combo_header, combo_header_span ){
        if( ! this.name ) return;
        if( this.is_multiple ) this.setValueMultiple( combo_header, combo_header_span );
        else this.setValueSimple( combo_header_span );
    }

    setValueSimple( combo_header_span ){
        const items = this.getItems( );
        const selected = items.filter( i => i.checked ).pop( );
        const FD = new FormData( );
        this.selected_value = selected ? selected.value : null;
        this.value = this.selected_value;
        if( this.selected_value !==undefined && this.selected_value !== null ){
            FD.append( this.name, this.selected_value );
            this.internals.setFormValue(FD);
            combo_header_span.innerHTML = selected.dataset.text;
        }
    }

    setValueMultiple( combo_header, combo_header_span ){
        const filtered_options = this.shadowRoot.querySelectorAll( 'input[type=checkbox]:checked' );
        const selected = Array.from(filtered_options).map( cb => cb.value || cb.innerText );

        let vals = selected.join(",");
        if( vals == '' && this.null_value != null ){
            vals = this.null_value;
        }

        this.value = vals;
        this.internals.setFormValue(vals);
        this.setAttribute('value', vals );

        combo_header_span.innerHTML = filtered_options.length > 0 ? combo_header.dataset.defaultText + ' <small>('+  filtered_options.length +')</small>' : combo_header.dataset.defaultText;
    }

    setSelectedOption( ){
        const header = this.shadowRoot.querySelector('.combo-header');
        const span = this.shadowRoot.querySelector('.combo-header span');
        this.setValue( header, span );
    }

    setName( ){
        if( this.attributes.name != undefined && this.attributes.name.value != '' ){
            this.items_name = this.attributes.name.value;
            if( this.is_multiple && ! /\[\]$/.test(this.items_name) ){
                this.items_name+= '[]';   
            }
        }
    }

    getNoneInput( ){
        const id = 'cb_null_' + Math.round( Math.random( ) * 999999 ) + 100000;
        const none_val = this.null_value || '';
        const checked = this.selected_value === none_val ? 'checked' : '';
    
        return /*html*/`
            <div>
                <input type='${this.tag_name}' value='${none_val}' id='${id}' name='${this.items_name}' ${checked} data-text='${this.null_label}' />
                <label for='${id}'>${this.null_label}</label>
            </div>
        `;
    }

    getSearchInput( ){
        const id = 'search_' + Math.round( Math.random( ) * 999999 ) + 100000;

        return /*html*/`
            <div class='search-bar'>
                <span>${this.search_label}</span>
                <input type='text' id='${id}' />
            </div>
        `;
    }

    sanitizeString( str ){
        return str.replaceAll( /[^\w\sáéíóúäëïöüñç]/ig, '_' );
    }

    filterOptions( value = '' ){
        const items = this.getItems( );
        items.forEach( i => { i.parentNode.classList.remove('hide'); } );

        if( value.trim( ) === '' ) return;

        items.forEach( i => {
            const er = new RegExp( this.sanitizeString( value ), 'i' );
            const name = this.sanitizeString( i.dataset.text );
            const val = i.value; 
            if( ! er.test( name ) && ! er.test( val ) ) i.parentNode.classList.add('hide');
        } );
    }

    clearSearchBar( ){
        const searchBar = this.shadowRoot.querySelector('.combo-body .search-bar');
        if( ! searchBar ) return;
        this.filterOptions( );
        const input = searchBar.querySelector( 'input', searchBar );
        if( input ) input.value = '';
    }

    scrollToSelected( combo_body ){
        const items = this.getItems( );
        let selected = items.filter( i => i.checked );
        if( selected.length == 0 ) selected = [ items[0] ]; 
        
        const div = selected[0].parentNode;
        const selected_top = div.offsetTop;
        const container_height = combo_body.offsetHeight; 
        if( selected_top > container_height ){
            combo_body.scrollTo( { top: selected_top - (container_height / 2) } );
        }
    }

    addListeners( ){
        const items = this.getItems( );

        const combo_header = this.shadowRoot.querySelector('.combo-header');
        const combo_body = this.shadowRoot.querySelector('.combo-body');

        items.forEach( cb => { 
            cb.addEventListener('click', e => { this.setSelectedOption( ); });
        });
        
        combo_header.addEventListener( 'click', e => {
            if( this.is_disabled ) return ;
            const visible_prev = document.querySelector('search-select.visible');
            if( visible_prev && visible_prev != this ) {
                visible_prev.classList.remove('visible');
            }
            
            this.clearSearchBar( );
            this.classList.toggle('visible');

            const input = combo_body.querySelector( '.search-bar input');
            if( input && this.classList.contains('visible') ){
                input.focus( );
                this.scrollToSelected( combo_body );
            }
            e.stopPropagation( );
        } );

        window.addEventListener('click', e => {
            this.clearSearchBar( );
            this.classList.remove('visible');
        } );


        window.addEventListener('keydown', e => {
            if( this.classList.contains('visible') ){
                
                if( /escape/i.test( e.key ) ){
                    this.clearSearchBar( );
                    this.classList.remove('visible');
                    e.preventDefault();
                }
                
            }
        });

        window.addEventListener('resize', e => {
            const span = this.shadowRoot.querySelector('.combo-header span');
            const old_val = span.innerHTML;
            this.style.removeProperty('--max-width' );
            const span_width = span.getBoundingClientRect().width; 
    
            this.style.setProperty('--max-width', ( Math.floor(span_width) - 4 ) + 'px' );
            span.innerHTML = old_val;
        } );

        if( this.is_multiple ){
            combo_body.addEventListener( 'click', e => { e.stopPropagation( ); } );
        }
    }

    addSearchBarListeners( ){
        const searchBar = this.shadowRoot.querySelector( '.combo-body .search-bar' );
        if( searchBar ){
            searchBar.addEventListener('click', e => { e.stopPropagation( ); });
            const input = searchBar.querySelector('input');
            if( input ) input.addEventListener('input', e => { this.filterOptions( input.value ) });
        }
    }

    render( ){
        const styles = this.getStyles( );
        const options = this.getOptions( );
        const noneInput = this.show_null && ! this.is_multiple ? this.getNoneInput( ) : '';
        const searchInput = this.show_search ? this.getSearchInput( ) : '';

        this.shadowRoot.innerHTML = `<style>${styles}</style>`; 
        this.shadowRoot.innerHTML += `
            <div class='combo-header' data-default-text='${ this.label }'><span>${ this.label }</span></div>
            <div class='combo-body'>
                ${searchInput}
                ${noneInput}
                ${options}
            </div>
        `;

        let largest = Math.max( ...this.items_lengths );
        if( this.max_value_width && largest > this.max_value_width ) largest = this.max_value_width; 
        this.style.setProperty('--sm-options-value-width', (parseInt(largest) + 1) + 'ch');

        if( searchInput != '' ) this.addSearchBarListeners( );
        if( options == '' || this.is_disabled ){ this.classList.add('disabled'); }
    }

    getStyles( ){
        return /*css*/`
         :host{
             display: inline-flex;
             position: relative;
             user-select: none;
             padding: 0 !important;
             font-size: 14px;
             line-height: 115%;
             box-sizing: border-box;
             --combo_padding_right___: 20px;
             --combo_padding_left___: 10px;
         }


        :host(.disabled){
             pointer-events: none !important;
        }

        :host(.disabled) .combo-header{
             background-color: #ededed !important;
             color: #AAA !important;
        }

         .combo-header{
             display: flex;
             flex: 1;
             align-items: center;
             border-radius: 4px;
             padding: 4px var(--combo_padding_right___) 4px var(--combo_padding_left___);
             background: none right 10px center no-repeat;
         }
 
         .combo-header span{
             flex: 1;
             display: block;
             white-space: nowrap;
             overflow: hidden;
             text-overflow: ellipsis;
             max-width: calc( 100% -2px );
         }

         .combo-header span small{
            font-size: .97em;
         }
  
         .combo-body{
             display: none;
             position: absolute;
             top: 100%;
             left: 0;
             min-width: 100%;
             max-width: 300px;
             background: white;
             box-shadow: 0 0 5px rgba(176,176,176,.7);
             max-height: 50vh;
             overflow-y: auto;
             scrollbar-width: thin; 
             min-height: 20px;
             z-index: 10;
         }
         
         :host(.visible) .combo-body{
             display: block;
         }
   
         .combo-body > div:not(.search-bar){
            display: flex;
         }

         .combo-body label{
             padding: 6px calc( 1em + 7px ) 6px calc( 1em + 12px );
             display: flex;
             flex: 1;
             line-height: 120%;
             white-space: nowrap;
             overflow: hidden;
             text-overflow: ellipsis;
             background: none 10px center/.5lh no-repeat;
         }
         
         .combo-body div.hide{
            display: none;
         }

         .combo-body label span.display-value{
             display: inline-block;
             font-variant-numeric: tabular-nums;
             margin-right: 5px;
             text-align: right;
             overflow: hidden;
             text-overflow: ellipsis;
         }

         .combo-body label span:not(.display-value){
            flex: 1;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
            display: block;
         }

         .combo-body label span.display-value + span{
            flex: none;
            width: calc(100% - 20px - var( --sm-options-value-width, 0 ));
         }
 
         .combo-body input{
             display: none;
         }
 
         .combo-body .search-bar{
             position: sticky;
             top: 0;
             left: 0;
             right: 0;
             display: flex;
             gap: 5px;
             padding: 6px 8px;
             align-items: center;
         }
 
         .combo-body .search-bar input{
             display: block;
             flex: 1;
             border: none;
             background: none;
             outline: none;
         }

         .combo-body .search-bar,
         .combo-body .search-bar input{
            font-size: .9rem;
            line-height: 1.2em;
            font-family: inherit;
         }

         /**
          * custom properties - user defined
         **/
        .combo-header{
            font-family: var( --sm-font, inherit );
            color: var( --sm-color, black );
            background-color: var( --sm-bg-color, white );
            background-image: var( --sm-bg-icon, url( 'data:image/svg+xml;base64,PHN2ZyBhcmlhLWhpZGRlbj0idHJ1ZSIgZm9jdXNhYmxlPSJmYWxzZSIgZGF0YS1wcmVmaXg9ImZhcyIgZGF0YS1pY29uPSJjaGV2cm9uLWRvd24iIGNsYXNzPSJzdmctaW5saW5lLS1mYSBmYS1jaGV2cm9uLWRvd24gZmEtdy0xNCIgcm9sZT0iaW1nIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA0NDggNTEyIj48cGF0aCBmaWxsPSJjdXJyZW50Q29sb3IiIGQ9Ik0yMDcuMDI5IDM4MS40NzZMMTIuNjg2IDE4Ny4xMzJjLTkuMzczLTkuMzczLTkuMzczLTI0LjU2OSAwLTMzLjk0MWwyMi42NjctMjIuNjY3YzkuMzU3LTkuMzU3IDI0LjUyMi05LjM3NSAzMy45MDEtLjA0TDIyNCAyODQuNTA1bDE1NC43NDUtMTU0LjAyMWM5LjM3OS05LjMzNSAyNC41NDQtOS4zMTcgMzMuOTAxLjA0bDIyLjY2NyAyMi42NjdjOS4zNzMgOS4zNzMgOS4zNzMgMjQuNTY5IDAgMzMuOTQxTDI0MC45NzEgMzgxLjQ3NmMtOS4zNzMgOS4zNzItMjQuNTY5IDkuMzcyLTMzLjk0MiAweiI+PC9wYXRoPjwvc3ZnPg==') );
            background-size: var( --sm-bg-size, .5lh ); 
        }

        .combo-body{
            scrollbar-color: var( --sm-scrollbar-front, #cecece ) var( --sm-scrollbar-back, white ); 
        }

        .combo-header,
        .combo-body{
            border: 1px solid var( --sm-border, #767676 );
        }

        /* */
        .combo-body div label{
            font-family: var( --sm-options-font, inherit );
            font-size: var( --sm-options-size, .92rem );
            color: var( --sm-options-color, black );
            background-color: var( --sm-options-bg, white );
        }

        .combo-body div:not(:last-child) label{
            border-bottom: 1px solid var( --sm-options-border, #DEDEDE );
        }

        .combo-body div label:hover{
            background-color: var( --sm-options-hover-bg, #1967D2 );
            color: var( --sm-options-hover-color, #F2F0F0 );
        }

        /* */
        .combo-body label span.display-value{
            color: var( --sm-options-value-color, #6F748B );
            width: var( --sm-options-value-width, 1ch );
        }

        .combo-body label:hover span.display-value{
            color: var( --sm-options-value-hover-color, var( --sm-options-value-color ) );
        }

        /* */

        .combo-body .search-bar{
            background: var( --sm-search-bg, #EDF2FA );
        }

        .combo-body .search-bar,
        .combo-body .search-bar input{
           color: var( --sm-search-color, #124BA5 );
        }
    
        .combo-body .search-bar span{
           color: var( --sm-search-label-color, var( --sm-search-color ) );
        }

        /* */
        .combo-body input + label{
            background-image: var( --sm-options-unchecked, none );
        }

        .combo-body input + label:hover{
            background-image: var( --sm-options-unchecked-hover, var( --sm-options-unchecked ) );
        }

        .combo-body input:checked + label{
            background-image: var( --sm-options-checked, url("data:image/svg+xml;base64,PHN2ZyBoZWlnaHQ9IjQxN3B0IiB2aWV3Qm94PSIwIC00NiA0MTcuODEzMzMgNDE3IiB3aWR0aD0iNDE3cHQiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHBhdGggZD0ibTE1OS45ODgyODEgMzE4LjU4MjAzMWMtMy45ODgyODEgNC4wMTE3MTktOS40Mjk2ODcgNi4yNS0xNS4wODIwMzEgNi4yNXMtMTEuMDkzNzUtMi4yMzgyODEtMTUuMDgyMDMxLTYuMjVsLTEyMC40NDkyMTktMTIwLjQ2ODc1Yy0xMi41LTEyLjUtMTIuNS0zMi43Njk1MzEgMC00NS4yNDYwOTNsMTUuMDgyMDMxLTE1LjA4NTkzOGMxMi41MDM5MDctMTIuNSAzMi43NS0xMi41IDQ1LjI1IDBsNzUuMTk5MjE5IDc1LjIwMzEyNSAyMDMuMTk5MjE5LTIwMy4yMDMxMjVjMTIuNTAzOTA2LTEyLjUgMzIuNzY5NTMxLTEyLjUgNDUuMjUgMGwxNS4wODIwMzEgMTUuMDg1OTM4YzEyLjUgMTIuNSAxMi41IDMyLjc2NTYyNCAwIDQ1LjI0NjA5M3ptMCAwIi8+PC9zdmc+")  );
            background-color: var( --sm-options-checked-bg, var( --sm-options-bg ) );
        }

        .combo-body input:checked + label span{
            color: var( --sm-options-checked-color, var( --sm-options-color ) );
        }

        .combo-body input:checked + label span.display-value{
            color: var( --sm-options-checked-value-color, var( --sm-options-value-color, #6F748B ) );
        }

        .combo-body input:checked + label:hover{
            background-image: var(  --sm-options-checked-hover-icon, var( --sm-options-checked ) );
            background-color: var( --sm-options-checked-hover-bg, var( --sm-options-hover-bg, #1967D2 ) );
        }
    
        .combo-body input:checked + label:hover span{
            color: var( --sm-options-checked-hover-color, var( --sm-options-hover-color ) );
        }
        .combo-body input:checked + label:hover span.display-value{
            color: var( --sm-options-checked-hover-value-color, var( --sm-options-checked-value-color ) );
        }
       `;
    }
}

customElements.define( 'select-multiple', SelectMutiple );