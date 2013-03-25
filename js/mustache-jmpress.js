//////////////////mustache jmpress////////////////////////////
//fonction qui recup�re le fichier json et stocke les donn�es dans data
$.getJSON('json/architecture-press.json', function(data) {
    // pour Mustache il faut un jeu de data (json) ainsi qu'un template (html+mustache)
    //� partir de ces deux variables, Mustache.to_html() cr�e une variable html (en string)
   
    //template
    //var template = $('#templateJmpress').html();
    var template = "{{#slide}} <div class='step slide {{step-number}}' data-x = '{{pos.x}}' data-y = '{{pos.y}}' "+
    "data-scale = '{{scale}}' > " +
    "{{title}}{{#element}} "+
    "  <div class = '{{type}}'  style='position: relative; left: {{pos.x}}px; right: {{pos.y}}'> {{description}} </div>  "+
    "{{/element}} </div>   {{/slide}}" ;
    

    
    
    //generation du html
    var html = Mustache.to_html(template, data);
    alert(html);
    
    //ajout du html � la div 
    $('#slideArea').append(html);
   
    
    //chargement des css propre � la pr�sentation puis lancement de la pr�sentation
    $('#scriptImpress').append( '<link id="impress-demo" href="css/impress-demo.css" rel="stylesheet" />');
    $('#slideArea').jmpress();
 
 
   
});
    
