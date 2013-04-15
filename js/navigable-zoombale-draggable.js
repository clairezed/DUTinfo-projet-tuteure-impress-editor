
var posData = {
    x: 0,
    y: 0
};

/* ======================================================================================
 * position de l'event (souris) dans le monde des slides  (real to virtual)
 * argument(s) : *event (souris)
 *               *div qui contient les slides (en object Jquery)
 * return : Array[ virtualTop, virtualLeft]
 * callBy : draggableKiki
 * ====================================================================================== */
function getVirtualCoord(event, $slideArea, flag) {   //flag = 0 -> slide
    var heightSlide = 700;          //pour le moment la hauteur de la slide conditionne la hauteur "vue" Ã  l'Ã©cran, lorsque zoomable fonctionnera il faudra un autre repere
    var MRH = window.innerHeight; //MaxRealHeight

    //var MVH = heightSlide * parseInt(parseFloat($slideArea.css("perspective")) / 1000);      //MaxVirtualHeight  //prise en compte deu zoom
    // var scale = ($slideArea.hasClass("step"))? parseInt(parseFloat($slideArea.css("perspective")) / 1000) : 1;  
    var scale;
    //console.log($qui);
    if (flag === 0) {
        scale = parseInt(parseFloat($slideArea.css("perspective")) / 1000);
    }
    else {
        scale = 1;
    }


    // console.log("scale " + scale);
    var MVH = heightSlide * scale;      //MaxVirtualHeight  //prise en compte deu zoom
    var RTop = event.pageY;      //RealTop (de la souris)

    //VirtualTop (position dans le monde des slides)
    var VTop = MVH * RTop / MRH; //prise en compte de la proportion
    VTop = Math.round(VTop);


    var MRL = window.innerWidth; //MaxRealWidth
    var ratio = MRL / MRH;  //rapport de zone d'Ã©cran du navigateur
    var MVL = ratio * MVH;      //MaxVirtualWidth
    var RLeft = event.pageX;      //RealTop (de la souris)

    //VirtualTop (position dans le monde des slides)
    var VLeft = MVL * RLeft / MRL; //prise en compte de la proportion
    VLeft = Math.round(VLeft);

    //console.log("MRH " + MRH + " MVH " + MVH + " VTop " + VTop + " Rtop " + RTop);
    //console.log("MRL " + MRL + " MVL " + MVL + " VLeft " + VLeft + " RLeft " + RLeft);

    var tab = new Array(VTop, VLeft);
    return tab;
}


/* ======================================================================================
 * position de l'element dans le monde reel (de l'Ã©cran du navigateur (virtualto real)
 * argument(s) : *element
 *               *div qui contient les slides (en object Jquery)
 * return : Array[ virtualTop, virtualLeft]
 * callBy : draggableKiki
 * ====================================================================================== */
function getRealCoord(element, $slideArea) {        //semble bien fonctionner
    //console.log("element select :" + element.html());

    var heightSlide = 700;      //pour le moment la hauteur de la slide conditionne la hauteur "vue" Ã  l'Ã©cran, lorsque zoomable fonctionnera il faudra un autre repere
    var MRH = window.innerHeight; //MaxRealHeight
    var MVH = heightSlide * parseInt(parseFloat($slideArea.css("perspective")) / 1000);      //MaxVirtualHeight
    var VTop = element.offset().top * parseInt(parseFloat($slideArea.css("perspective")) / 1000);      //VirtualTop (de l'element)

    var RTop = MRH * VTop / MVH; //prise en compte de la proportion
    RTop = Math.round(RTop);    //prise en compte du zoom



    var MRL = window.innerWidth; //MaxRealWidth
    var ratio = MRL / MRH;  //rapport de zone d'Ã©cran du navigateur
    var MVL = ratio * MVH;    //MaxVirtualWidth
    var VLeft = element.offset().left * parseInt(parseFloat($slideArea.css("perspective")) / 1000);      //RealTop (de la souris)

    //VirtualTop (position dans le monde des slides)
    var RLeft = MRL * VLeft / MVL; //prise en compte de la proportion
    RLeft = Math.round(RLeft);  //prise en compte du zoom


    //console.log("position de element calculÃ© ds l'Ã©cran MRH " + MRH + " MVH " + MVH + " VTop " + VTop + " Rtop " + RTop + "     fameux coef : " + parseInt(parseFloat($slideArea.css('perspective')) / 1000));
    //console.log("position de element calculÃ© ds l'Ã©cran MRL " + MRL + " MVL " + MVL + " VLeft " + VLeft + " RLeft " + RLeft);

    var tab = new Array(RTop, RLeft);
    return tab;
}



/* ======================================================================================
 * permet de rendre draggable un element
 * 
 * $(element).draggableKiki();
 * 
 * ====================================================================================== */

//fait suivre la souris à un objet
function move(event, $objet) {
    var $slideArea = $("#slideArea");

    var offX = $objet.attr("offX");
    var offY = $objet.attr("offY");
    if ($objet.hasClass("step")) {
        var flag = 0;
    }
    else {
        var flag = 1;
    }

    var tab = getVirtualCoord(event, $slideArea, flag);      //recupÃ©ration des coord virtuelle de la souris
    var VTop = tab[0];
    var VLeft = tab[1];

    //compension du lieu de click
    VTop = VTop - offY;
    VLeft = VLeft - offX;


    //mise à jour de la position
    if ($objet.hasClass("element")) {

        $('#slideArea').jmpress('deinit', $objet.parent());
        //TODO màj du json
        $objet.css("left", VLeft);
        $objet.css("top", VTop);
        $('#slideArea').jmpress('init', $objet.parent());
    }

    if ($objet.hasClass("step")) {
        $('#slideArea').jmpress('deinit', $objet);
        //TODO màj du json
        $objet.attr("data-x", VLeft);
        $objet.attr("data-y", VTop);
        $('#slideArea').jmpress('init', $objet);
    }
}
;

//determine l'offset pour le drag from where you click
function offSet(event, $objet) {


    if ($objet.hasClass("step")) {
        var $slideArea = $("#slideArea");
    }

    if ($objet.hasClass("form")) {
        var $slideArea = $objet.parent();
    }

    //position virtuelle dans le monde des slides de la souris
    if ($objet.hasClass("step")) {
        var flag = 0;
    }
    else {
        var flag = 1;
    }
    var tab = getVirtualCoord(event, $slideArea, flag);
    var VTopMouse = tab[0];
    var VLeftMouse = tab[1];

/////////////////////////////////////////////////////////////////////
////    DANGER LORS DU PASSAGE a la 3D  data-x va posser de GROS probleme lorsqu'on sera en 3D (il faudra faire des projetÃ©
///la solution pourrait être de ne pas permettre de selectionner un element n'importe ou mais par endroit (pt d'ancrage) particulier
///en effet, ici il y a un soucis au niveau du projeté de la slide si elle est de travers
///que choisit on ? 
    if ($objet.hasClass("step")) {
        var offTop = $objet.attr("data-y");//$objet.offset().top;          
        var offLeft = $objet.attr("data-x");//$objet.offset().left;
    }

    if ($objet.hasClass("element")) {
        var offTop = parseFloat($objet.css("top"));
        var offLeft = parseFloat($objet.css("left"));
    }
////////////////////////////////////:


    $objet.attr("offX", "" + VLeftMouse - offLeft + "");
    $objet.attr("offY", "" + VTopMouse - offTop + "");
}
;

/* methode Kiki qui fonctionne */
$(document).on("mousemove", function(event) {

    $(".dragged").each(function() {
        move(event, $(this));
    });

});

$(document).on("mouseup", function(event) {
    $(".dragged").each(function() {
        $(this).removeClass("dragged");
    });
});


jQuery.fn.draggableKiki = function() {

//    $(this).on("mouseup", function() {      //le probleme c'est que la slide au dessus capte l'event
//        console.log("mouseup du draggable" + $(this).html());
//        $(this).off(".movable");
//
//    });
//    


    $(this).on("mousedown.movable", function(event) {

        $(this).addClass("dragged");
        offSet(event, $(this));


        event.stopImmediatePropagation();           //empeche l'event de bubble jusqu'à la slide mère et le document, ainsi pas de conflits avec le navigable
//
//        $(this).on("mousemove.movable", function(event) {
//            move(event, $(this));
//        });



    });



};



/* ======================================================================================
 * deplacement au sein de la présentation
 * 
 * ====================================================================================== */

$(document).on('mousedown', function(event) {           //le fucking probleme avec cette methode c'est que le mousemove et mouseup sont absorbé par une autre slide si notre draggable passe dessous

    //zone ou sont stocker les slides 
    var $slideMother = $("#slideArea >");
    var $slideGrandMother = $("#slideArea");
    posData.x = event.pageX;
    posData.y = event.pageY;
    //console.log("mousedown");


    $(this).on('mousemove.navigable', function(event) {

        //recupération des coord du translate 3D
        var oldposView = $slideMother.css("transform");

        oldposView = oldposView.split('(')[1];
        oldposView = oldposView.split(')')[0];
        oldposView = oldposView.split(',');

        var posView = {
            x: oldposView[4],
            y: oldposView[5]
        };


        //recupération de déplacement de la souris
        var dReal = {//element différentiel reel
            x: event.pageX - posData.x,
            y: event.pageY - posData.y
        };

        //calcul du déplacement dans le monde des slides
        var scale = -parseInt(parseFloat($slideGrandMother.css("perspective")) / 1000);
        var dVirtuel = {//element différentiel virtuel
            x: dReal.x * scale,
            y: dReal.y * scale
        };


        //console.log(trX + " " + trY + " Virtual event " + event.pageX + "  " + event.pageY + " " + Vevent[1] + " " + Vevent[0]);

        //calcul de la nouvelle position du viewport
        var newPosView = {
            x: parseInt(posView.x - dVirtuel.x),
            y: parseInt(posView.y - dVirtuel.y)
        };

        //mise à jour de l'ancienne position de souris, pour avoir l'element différent de déplacement reel
        posData.x = event.pageX;
        posData.y = event.pageY;


        $slideMother.css({
            'transform': 'translate3d(' + newPosView.x + 'px,' + newPosView.y + 'px,0px)'
        });

    });

    $(this).on("mouseup", function() {
        console.log("mouseup du navigable");
        $(this).off(".navigable");
    });

});

//// pour effectuer le zoomable                 
$(document).mousewheel(function(event, delta, deltaX, deltaY) {
    var $slideMother = $("#slideArea >");
    var $slideGrandMother = $("#slideArea");

    //recupération des coord du transform scale
    var oldScale = $slideGrandMother.css("transform");
    oldScale = oldScale.split('(')[1];
    oldScale = oldScale.split(')')[0];
    oldScale = oldScale.split(',');

    var a = 0.1 / 10;
    var b = 0;
    var coef = a * oldScale[0] + b;
    var diff = deltaY * coef;
    var newScale = parseFloat(oldScale[0]) + diff;

    if (newScale < 0.001) {
        console.log("zoom out max");
        newScale = 0.001;
    } else if (newScale > 10) {
        console.log("zomm in max");
        newScale = 10;
    }


    $slideGrandMother.css({
        'transform': 'scaleX(' + newScale + ') scaleY(' + newScale + ') '
    });

    //màj de la perspective qui est utiliséé par les fonctions de changement de monde
    var perspective = Math.round(1 / newScale * 1000);
    //il faudrait augmenter la précision du newScale afin de palier à l'écart de deplacement lors d'un fort dezoom
    $slideGrandMother.css("perspective", perspective);

});


