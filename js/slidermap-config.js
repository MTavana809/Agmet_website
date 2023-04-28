'use strict'; // https://javascript.info/strict-mode for explanation

require([
    'esri/Map',
    'esri/Basemap',
    'esri/geometry/Point',
    'esri/views/MapView',
    'esri/widgets/ScaleBar',
    'esri/widgets/Slider',
    'esri/widgets/Home',
    'esri/widgets/Legend',
    'esri/widgets/Expand',
    'esri/widgets/Swipe',
    'esri/layers/ImageryLayer',
    'esri/layers/support/RasterFunction',
    'esri/layers/support/MosaicRule',
    'esri/layers/support/DimensionalDefinition',
    'esri/renderers/RasterStretchRenderer',
    'esri/tasks/support/AlgorithmicColorRamp',
    'esri/tasks/support/MultipartColorRamp',
    'esri/smartMapping/symbology/support/colorRamps',
    'esri/renderers/RasterColormapRenderer',
    'esri/symbols/support/symbolUtils'
], (Map,
    Basemap,
    Point,
    MapView,
    ScaleBar,
    Slider,
    Home,
    Legend,
    Expand,
    Swipe,
    ImageryLayer,
    RasterFunction,
    MosaicRule,
    DimensionalDefinition,
    RasterStretchRenderer,
    AlgorithmicColorRamp,
    MultipartColorRamp,
    colorRamps,
    RasterColormapRenderer,
    symbolUtils) => {

    // new basemap definition 
    const basemap = new Basemap({
        portalItem: {
            id: '54140d826fe34135abb3b60c157170dc' // os_open_greyscale_no_labels
        }
    });

    // create map
    const map = new Map({
        basemap: basemap,
        layers: []
    });

    // create 2D view for the Map
    const view = new MapView({
        container: 'mapDiv',
        map: map,
        center: new Point({ x: 260000, y: 785000, spatialReference: 27700 }), // reprojected to allow OS basemap
        zoom: 8
    });

    // create renderer for countOfDay
    const colorRamp1 = new AlgorithmicColorRamp({
        algorithm: 'lab-lch',
        fromColor: [0, 104, 55, 1],
        toColor: [26, 152, 80, 1]
    });
    const colorRamp2 = new AlgorithmicColorRamp({
        algorithm: 'lab-lch',
        fromColor: [26, 152, 80, 1],
        toColor: [102, 189, 99, 1]
    });
    const colorRamp3 = new AlgorithmicColorRamp({
        algorithm: 'lab-lch',
        fromColor: [102, 189, 99, 1],
        toColor: [166, 217, 106, 1]
    });
    const colorRamp4 = new AlgorithmicColorRamp({
        algorithm: 'lab-lch',
        fromColor: [166, 217, 106, 1],
        toColor: [217, 239, 139, 1]
    });
    const colorRamp5 = new AlgorithmicColorRamp({
        algorithm: 'lab-lch',
        fromColor: [217, 239, 139, 1],
        toColor: [255, 255, 191, 1]
    });
    const colorRamp6 = new AlgorithmicColorRamp({
        algorithm: 'lab-lch',
        fromColor: [255, 255, 191, 1],
        toColor: [254, 224, 139, 1]
    });
    const colorRamp7 = new AlgorithmicColorRamp({
        algorithm: 'lab-lch',
        fromColor: [254, 224, 139, 1],
        toColor: [253, 174, 97, 1]
    });
    const colorRamp8 = new AlgorithmicColorRamp({
        algorithm: 'lab-lch',
        fromColor: [253, 174, 97, 1],
        toColor: [244, 109, 67, 1]
    });
    const colorRamp9 = new AlgorithmicColorRamp({
        algorithm: 'lab-lch',
        fromColor: [244, 109, 67, 1],
        toColor: [215, 48, 39, 1]
    });
    const colorRamp10 = new AlgorithmicColorRamp({
        algorithm: 'lab-lch',
        fromColor: [215, 48, 39, 1],
        toColor: [165, 0, 38, 1]
    });

    const combineColorRamp = new MultipartColorRamp({
        colorRamps: [colorRamp1, colorRamp2, colorRamp3, colorRamp4, colorRamp5, colorRamp6,
            colorRamp7, colorRamp8, colorRamp9, colorRamp10
        ]
    });

    const countOfDayRenderer = new RasterStretchRenderer({
        colorRamp: combineColorRamp, //flowerColorRamp
        stretchType: 'min-max',
        //statistics: [
        //  [1, 60, 5, 5]
        //   ] // min, max, avg, stddev
    });

    /******************************
     * Layer rules
     * ****************************/
    // create server-defined raster function
    let serviceRasterFunctionLeft = new RasterFunction({
        functionName: 'plantheatstress_count'
    });
    let serviceRasterFunctionRight = new RasterFunction({
        functionName: 'accumulatedfrost_degreedays'
    });

    // set initial variable and dimension on mosaic dataset
    const yearDefinitionLeft = new DimensionalDefinition({
        variableName: 'plantheatstress_count',
        dimensionName: 'Year',
        values: [1961],
        isSlice: true
    });
    const yearDefinitionRight = new DimensionalDefinition({
        variableName: 'accumulatedfrost_degreedays',
        dimensionName: 'Year',
        values: [1961],
        isSlice: true
    });

    // create mosaicRule and set multidimensionalDefinition
    let mosaicRuleLeft = new MosaicRule({
        multidimensionalDefinition: [yearDefinitionLeft]
    });
    let mosaicRuleRight = new MosaicRule({
        multidimensionalDefinition: [yearDefinitionRight]
    });

    // Set up popup template
    let indicatorLayerPopupTemplate = {
        title: '',
        content: '<b>{Raster.ItemPixelValue}</b> total days in <b>{Year}</b> when the maximum temperature is greater than 25\u00B0C',
        fieldInfos: [{
            fieldName: 'Raster.ItemPixelValue',
            format: {
                places: 0,
                digitSeparator: true
            }
        }]
    };
    // remove dockability
    view.popup = {
        dockOptions: {
            buttonEnabled: false
        }
    };

    // create and add imagery layer to view
    const indicatorLayer = new ImageryLayer({
        title: [], //The legend automatically updates when a layer's renderer, opacity, or title is changed
        url: 'https://abgis03.hutton.ac.uk:6443/arcgis/rest/services/Agmet/Ensemble4/ImageServer',
        mosaicRule: mosaicRuleLeft,
        renderer: countOfDayRenderer,
        renderingRule: serviceRasterFunctionLeft,
        // popupTemplate: {
        //     title: '',
        //     content: '<b>{Raster.ItemPixelValue}</b> degree days in <b>{Year}</b> when the minimum temperature is less than 0\u00B0C',
        //     fieldInfos: [{
        //         fieldName: 'Raster.ItemPixelValue',
        //         format: {
        //             places: 0,
        //             digitSeparator: true
        //         }
        //     }]
        // },
        opacity: 0.8
    });
    map.add(indicatorLayer);

    // create and SECOND add imagery layer to view for SWIPE
    const indicatorLayer2 = new ImageryLayer({
        title: [], //The legend automatically updates when a layer's renderer, opacity, or title is changed
        url: 'https://abgis03.hutton.ac.uk:6443/arcgis/rest/services/Agmet/Ensemble5/ImageServer',
        mosaicRule: mosaicRuleRight,
        renderer: countOfDayRenderer,
        renderingRule: serviceRasterFunctionRight,
        // popupTemplate: indicatorLayerPopupTemplate,
        opacity: 0.8
    });
    map.add(indicatorLayer2);

    /******************************
     * Swipe
     *******************************/
    const swipe = new Swipe({
        view: view,
        leadingLayers: [indicatorLayer],
        trailingLayers: [indicatorLayer2],
        direction: 'horizontal',
        position: 50
    });
    view.ui.add(swipe);


    /******************************
     * programmatically make selectors 
     *******************************/
    const selectorExpressions = [
        [`accumulatedfrost_degreedays`, `Accumulated Frost (degree days)`],
        [`airfrost_count`, `Air Frost (count of days)`],
        [`cold_spell_n`, `Cold Spell (count of days)`],
        [`dry_count`, `Dry Count (count of days)`],
        [`dry_spell_n`, `Dry Spell (count of days)`],
        [`end_growingseason`, `End of Growing Season (day of year)`],
        [`first_airfrost_doy`, `First Airfrost (day of year)`],
        [`first_grassfrost_doy`, `First Grassfrost (day of year)`],
        [`grassfrost_count`, `Grassfrost Count (count of days)`],
        [`growing_degreedays`, `Growing (degree days)`],
        [`growing_season`, `Growing Season (count of days)`],
        [`growseason_length`, `Grow Season Length (count of days)`],
        [`growseason_range`, `Grow Season Range (count of days)`],
        [`heating_degreedays`, `Heating (degree days)`],
        [`heatwave_n`, `Heatwave (count of days)`],
        [`last_airfrost_doy`, `Last Airfrost (day of year)`],
        [`last_grassfrost_doy`, `Last Grassfrost (day of year)`],
        [`p_intensity`, `P Intensity (index)`],
        [`p_seasonality`, `P Seasonality (index)`],
        [`personheatstress_count`, `Person Heat Stress (count of days)`],
        [`plantheatstress_count`, `Plant Heat Stress (count of days)`],
        [`start_fieldops_doy`, `Start FieldOps (day of year)`],
        [`start_grow_doy`, `Start Grow (day of year)`],
        [`tempgrowingperiod_length`, `Temp Growing Period (count of days)`],
        [`thermaltime_sum`, `Thermal Time (degree days)`],
        [`wet_count`, `Wet Count (count of days)`],
        [`wet_spell_n`, `Wet Spell (count of days)`],
        [`wettestweek_doy`, `Wettest Week (day of year)`],
        [`wettestweek_mm`, `Wettest Week (mm)`]
    ]

    // selectDivs configs
    const selectDivLeft = document.createElement('div');
    const selectDivRight = document.createElement('div');
    const selectDivs = [selectDivLeft, selectDivRight]

    selectDivs.forEach(element => {
        element.setAttribute('id', 'selectDivLeft');
        element.setAttribute('class', 'esri-widget');
        element.setAttribute('style', 'padding: 0 10px 10px 10px;background-color:white;');
    });

    selectDivLeft.innerHTML = '<p>Select Agrometeorological Indicator on the LEFT:<p>';
    selectDivRight.innerHTML = '<p>Select Agrometeorological Indicator on the RIGHT:<p>';

    const selectFilterLeft = document.createElement('select');
    const selectFilterRight = document.createElement('select');
    const selectFilters = [selectFilterLeft, selectFilterRight];

    selectFilters.forEach(element => {
        element.setAttribute('id', 'selectFilterLeft');
        element.setAttribute('class', 'esri-widget');
    })

    selectDivLeft.appendChild(selectFilterLeft);
    selectDivRight.appendChild(selectFilterRight);

    // make options and add labels for each 
    selectorExpressions.forEach(element => {
        let option = document.createElement('option');
        option.value = element[0];
        option.innerHTML = element[1];

        selectFilterRight.appendChild(option);
        let optionClone = option.cloneNode(true);
        selectFilterLeft.appendChild(optionClone);
    });

    // make plantheatstress_count selected 
    selectFilterLeft.value = 'plantheatstress_count';

    // add selectDivs to view
    view.ui.add(selectDivLeft, 'top-left');
    view.ui.add(selectDivRight, 'top-right');

    /******************************
     * selectorDiv configs
     * ****************************/
    //listen to change events on indicatorSelect and change multidimensional variable
    const descriptorDiv = document.getElementById('descriptorDiv');

    selectFilterLeft.addEventListener('change', () => {
        const chosenIndicator = selectFilterLeft.value;
        changeIndicatorLeft(chosenIndicator);
        changeDescriptorsLeft(chosenIndicator);
        stopAnimation();
    });

    selectFilterRight.addEventListener('change', () => {
        const chosenIndicator = selectFilterRight.value;
        changeIndicatorRight(chosenIndicator);
        changeDescriptorsRight(chosenIndicator);
        stopAnimation();
    });

    function changeIndicatorLeft(chosenIndicator) {
        //close popupTemplate if open
        if (view.popup.visible) {
            view.popup.close()
        };

        // change mosaicRule of layer as clone and reassign
        const mosaicRuleClone = indicatorLayer.mosaicRule.clone(); // makes clone of layer's mosaicRule
        const indicatorVariable = mosaicRuleClone.multidimensionalDefinition[0];
        indicatorVariable.values = yearSlider.get('values');
        indicatorVariable.variableName = chosenIndicator;
        mosaicRuleClone.multidimensionalDefinition = [indicatorVariable];
        indicatorLayer.mosaicRule = mosaicRuleClone;

        // change renderingRule (raster function) of layer as clone and reassign 
        const renderingRuleClone = indicatorLayer.renderingRule.clone();
        renderingRuleClone.functionName = chosenIndicator;
        indicatorLayer.renderingRule = renderingRuleClone;

        //swipe configs
        swipe.leadingLayers.splice(0, indicatorLayer);
    };

    function changeIndicatorRight(chosenIndicator) {
        //close popupTemplate if open
        if (view.popup.visible) {
            view.popup.close()
        };

        // change mosaicRule of layer as clone and reassign
        const mosaicRuleClone = indicatorLayer2.mosaicRule.clone(); // makes clone of layer's mosaicRule
        const indicatorVariable = mosaicRuleClone.multidimensionalDefinition[0];
        indicatorVariable.values = yearSlider.get('values');
        indicatorVariable.variableName = chosenIndicator;
        mosaicRuleClone.multidimensionalDefinition = [indicatorVariable];
        indicatorLayer2.mosaicRule = mosaicRuleClone;

        // change renderingRule (raster function) of layer as clone and reassign 
        const renderingRuleClone = indicatorLayer2.renderingRule.clone();
        renderingRuleClone.functionName = chosenIndicator;
        indicatorLayer2.renderingRule = renderingRuleClone;

        //swipe configs
        swipe.trailingLayers.splice(0, indicatorLayer2);
    };

    /************************************
     * Year Slider
     *************************************/
    const yearSlider = new Slider({
        container: 'yearSlider',
        min: 1981,
        max: 2080,
        values: [1981],
        precision: 0,
        snapOnClickEnabled: true,
        visibleElements: {
            labels: true,
            rangeLabels: true
        },
        // steps: 100,
        tickConfigs: [{
            // mode: 'position',
            // values: [1970, 1980, 1990, 2000, 2010, 2020, 2030, 2040, 2050, 2060, 2070],
            mode: 'count',
            values: 119,
            labelsVisible: false,
        }]
    });

    // when the user changes the yearSlider's value, change the year to reflect data
    yearSlider.on(['thumb-change', 'thumb-drag'], event => {
        //close popupTemplate if open
        if (view.popup.visible) {
            view.popup.close()
        };
        stopAnimation();
        updateYearDef(event.value);
        updateYearDef2(event.value);
    });

    // read all other values when year updates
    function updateYearDef() {
        const mosaicRuleClone = indicatorLayer.mosaicRule.clone(); // makes clone of layer's mosaicRule
        const yearVariable = mosaicRuleClone.multidimensionalDefinition[0];
        yearVariable.values = yearSlider.get('values');
        mosaicRuleClone.multidimensionalDefinition = [yearVariable];
        indicatorLayer.mosaicRule = mosaicRuleClone;
    };

    function updateYearDef2() {
        const mosaicRuleClone = indicatorLayer2.mosaicRule.clone(); // makes clone of layer's mosaicRule
        const yearVariable = mosaicRuleClone.multidimensionalDefinition[0];
        yearVariable.values = yearSlider.get('values');
        mosaicRuleClone.multidimensionalDefinition = [yearVariable];
        indicatorLayer2.mosaicRule = mosaicRuleClone;
    };

    // set var for play button 
    const playButton = document.getElementById('playButton');

    // Toggle animation on/off when user
    // clicks on the play button
    playButton.addEventListener('click', () => {
        if (playButton.classList.contains('toggled')) {
            stopAnimation();
        } else {
            startAnimation();
        }
    });
    let timerId = 0;

    // Starts the animation that cycle through the years
    function startAnimation() {
        stopAnimation();
        timerId = setInterval(() => {
                let year = yearSlider.values[0];
                year += 1;
                if (year > yearSlider.max) {
                    year = yearSlider.min;
                }
                yearSlider.values = [year];
                updateYearDef(year);
                updateYearDef2(year);
            }, 700) // speed of playback, milliseconds
        playButton.classList.add('toggled');
    };

    // Stops the animation
    function stopAnimation() {
        if (!timerId) {
            return;
        }
        clearTimeout(timerId);
        timerId = 0;
        playButton.classList.remove('toggled');
    };

    /******************************
     * Small ui widgets
     *******************************/
    // moves the zoom widget to other corner
    view.ui.move('zoom', 'bottom-right');

    // create  and add scale bar to view
    const scaleBar = new ScaleBar({
        view: view,
        unit: 'dual' // The scale bar displays both metric and non-metric units.
    });

    // create and add home button to view 
    const home = new Home({
        view: view
    });

    // add elements in order
    view.ui.add([scaleBar, home], 'bottom-right');

    // create and add legend to view 
    const legend = new Legend({
        view: view,
        layerInfos: [{
            layer: indicatorLayer,
            title: [`Plant Heat Stress: count of days when Tmax > 25\u00B0C`]
        }]
    });

    // create and add SECOND legend to view 
    const legend2 = new Legend({
        view: view,
        layerInfos: [{
            layer: indicatorLayer2,
            title: [`Accumulated Frost (degree days): sum of degree days where Tmin < 0\u00B0C`]
        }]
    });

    view.ui.add(legend, 'top-left');
    view.ui.add(legend2, 'top-right');

    /******************************
     * Expand descriptorDiv
     *******************************/
    const descriptorDivExpand = new Expand({
        view: view,
        content: descriptorDiv,
        expandIconClass: 'esri-icon-description',
        expanded: true
    });
    view.ui.add(descriptorDivExpand, 'bottom-left');

    // delay descriptorDiv load 
    function initialSetup() {
        if (document.getElementById('descriptorDiv') != null) {
            setTimeout(() => {
                document.getElementById('descriptorDiv').style.display = 'block';
            }, 1000);
        }
    };
    initialSetup();

    //move expand button to more like modal box

    /******************************
     * Lengthy Configs
     *******************************/
    // change title of layer for Legend display
    // change description in descriptorDiv
    function changeDescriptorsLeft(chosenIndicator) {
        switch (chosenIndicator) {
            case 'accumulatedfrost_degreedays':
                indicatorLayer.title = accumulatedfrost_legend
                descriptorDiv.innerHTML = accumulatedfrost_desc
                break;
            case 'airfrost_count':
                indicatorLayer.title = airfrostcount_legend
                descriptorDiv.innerHTML = airfrostcount_desc
                break;
            case 'cold_spell_n':
                indicatorLayer.title = coldspell_legend
                descriptorDiv.innerHTML = coldspell_desc
                break;
            case 'dry_count':
                indicatorLayer.title = drycount_legend
                descriptorDiv.innerHTML = drycount_desc
                break;
            case 'dry_spell_n':
                indicatorLayer.title = dryspell_legend
                descriptorDiv.innerHTML = dryspell_desc
                break;
            case 'end_growingseason':
                indicatorLayer.title = endgrowing_legend
                descriptorDiv.innerHTML = endgrowing_desc
                break;
            case 'first_airfrost_doy':
                indicatorLayer.title = firstairfrost_legend
                descriptorDiv.innerHTML = firstairfrost_desc
                break;
            case 'first_grassfrost_doy':
                indicatorLayer.title = firstgrassfrost_legend
                descriptorDiv.innerHTML = firstgrassfrost_desc
                break;
            case 'grassfrost_count':
                indicatorLayer.title = grassfrostcount_legend
                descriptorDiv.innerHTML = grassfrostcount_desc
                break;
            case 'growing_degreedays':
                indicatorLayer.title = growingdd_legend
                descriptorDiv.innerHTML = growingdd_desc
                break;
            case 'growing_season':
                indicatorLayer.title = growingseason_legend
                descriptorDiv.innerHTML = growingseason_desc
                break;
            case 'growseason_length':
                indicatorLayer.title = growseasonlength_legend
                descriptorDiv.innerHTML = growseasonlength_desc
                break;
            case 'growseason_range':
                indicatorLayer.title = growseasonrange_legend
                descriptorDiv.innerHTML = growseasonrange_desc
                break;
            case 'heating_degreedays':
                indicatorLayer.title = heatingdd_legend
                descriptorDiv.innerHTML = heatingdd_desc
                break;
            case 'heatwave_n':
                indicatorLayer.title = heatwave_legend
                descriptorDiv.innerHTML = heatwave_desc
                break;
            case 'last_airfrost_doy':
                indicatorLayer.title = lastairfrost_legend
                descriptorDiv.innerHTML = lastairfrost_desc
                break;
            case 'last_grassfrost_doy':
                indicatorLayer.title = lastgrassfrost_legend
                descriptorDiv.innerHTML = lastgrassfrost_desc
                break;
            case 'p_intensity':
                indicatorLayer.title = pintensity_legend
                descriptorDiv.innerHTML = pintensity_desc
                break;
            case 'p_seasonality':
                indicatorLayer.title = pseasonality_legend
                descriptorDiv.innerHTML = pseasonality_desc
                break;
            case 'personheatstress_count':
                indicatorLayer.title = personheatstress_legend
                descriptorDiv.innerHTML = personheatstress_desc
                break;
            case 'plantheatstress_count':
                indicatorLayer.title = plantheatstress_legend
                descriptorDiv.innerHTML = plantheatstress_desc
                break;
            case 'start_fieldops_doy':
                indicatorLayer.title = startfieldops_legend
                descriptorDiv.innerHTML = startfieldops_desc
                break;
            case 'start_grow_doy':
                indicatorLayer.title = startgrowdoy_legend
                descriptorDiv.innerHTML = startgrowdoy_desc
                break;
            case 'tempgrowingperiod_length':
                indicatorLayer.title = tempgrowingperiod_legend
                descriptorDiv.innerHTML = tempgrowingperiod_desc
                break;
            case 'thermaltime_sum':
                indicatorLayer.title = thermaltime_legend
                descriptorDiv.innerHTML = thermaltime_desc
                break;
            case 'wet_count':
                indicatorLayer.title = wetcount_legend
                descriptorDiv.innerHTML = wetcount_desc
                break;
            case 'wet_spell_n':
                indicatorLayer.title = wetspell_legend
                descriptorDiv.innerHTML = wetspell_desc
                break;
            case 'wettestweek_doy':
                indicatorLayer.title = wettestweekdoy_legend
                descriptorDiv.innerHTML = wettestweekdoy_desc
                break;
            case 'wettestweek_mm':
                indicatorLayer.title = wettestweekmm_legend
                descriptorDiv.innerHTML = wettestweekmm_desc
                break;
        };
    };

    // change title of layer for Legend display ON THE RIGHT
    function changeDescriptorsRight(chosenIndicator) {
        switch (chosenIndicator) {
            case 'accumulatedfrost_degreedays':
                indicatorLayer2.title = accumulatedfrost_legend
                break;
            case 'airfrost_count':
                indicatorLayer2.title = airfrostcount_legend
                break;
            case 'cold_spell_n':
                indicatorLayer2.title = coldspell_legend
                break;
            case 'dry_count':
                indicatorLayer2.title = drycount_legend
                break;
            case 'dry_spell_n':
                indicatorLayer2.title = dryspell_legend
                break;
            case 'end_growingseason':
                indicatorLayer2.title = endgrowing_legend
                break;
            case 'first_airfrost_doy':
                indicatorLayer2.title = firstairfrost_legend
                break;
            case 'first_grassfrost_doy':
                indicatorLayer2.title = firstgrassfrost_legend
                break;
            case 'grassfrost_count':
                indicatorLayer2.title = grassfrostcount_legend
                break;
            case 'growing_degreedays':
                indicatorLayer2.title = growingdd_legend
                break;
            case 'growing_season':
                indicatorLayer2.title = growingseason_legend
                break;
            case 'growseason_length':
                indicatorLayer2.title = growseasonlength_legend
                break;
            case 'growseason_range':
                indicatorLayer2.title = growseasonrange_legend
                break;
            case 'heating_degreedays':
                indicatorLayer2.title = heatingdd_legend
                break;
            case 'heatwave_n':
                indicatorLayer2.title = heatwave_legend
                break;
            case 'last_airfrost_doy':
                indicatorLayer2.title = lastairfrost_legend
                break;
            case 'last_grassfrost_doy':
                indicatorLayer2.title = lastgrassfrost_legend
                break;
            case 'p_intensity':
                indicatorLayer2.title = pintensity_legend
                break;
            case 'p_seasonality':
                indicatorLayer2.title = pseasonality_legend
                break;
            case 'personheatstress_count':
                indicatorLayer2.title = personheatstress_legend
                break;
            case 'plantheatstress_count':
                indicatorLayer2.title = plantheatstress_legend
                break;
            case 'start_fieldops_doy':
                indicatorLayer2.title = startfieldops_legend
                break;
            case 'start_grow_doy':
                indicatorLayer2.title = startgrowdoy_legend
                break;
            case 'tempgrowingperiod_length':
                indicatorLayer2.title = tempgrowingperiod_legend
                break;
            case 'thermaltime_sum':
                indicatorLayer2.title = thermaltime_legend
                break;
            case 'wet_count':
                indicatorLayer2.title = wetcount_legend
                break;
            case 'wet_spell_n':
                indicatorLayer2.title = wetspell_legend
                break;
            case 'wettestweek_doy':
                indicatorLayer2.title = wettestweekdoy_legend
                break;
            case 'wettestweek_mm':
                indicatorLayer2.title = wettestweekmm_legend
                break;
        };

    };

    // change popupTemplate of layer as clone and reassign
    function changePopup(chosenIndicator) {
        const popupTemplateClone = indicatorLayer.popupTemplate.clone();
        let popupCloneContent = popupTemplateClone.content;
        switch (chosenIndicator) {
            case 'accumulatedfrost_degreedays':
                popupCloneContent = accumulatedfrost_popup
                break;
            case 'airfrost_count':
                popupCloneContent = airfrostcount_popup
                break;
            case 'cold_spell_n':
                popupCloneContent = coldspell_popup
                break;
            case 'dry_count':
                popupCloneContent = drycount_popup
                break;
            case 'dry_spell_n':
                popupCloneContent = dryspell_popup
                break;
            case 'end_growingseason':
                popupCloneContent = endgrowing_popup
                break;
            case 'first_airfrost_doy':
                popupCloneContent = firstairfrost_popup
                break;
            case 'first_grassfrost_doy':
                popupCloneContent = firstgrassfrost_popup
                break;
            case 'grassfrost_count':
                popupCloneContent = grassfrostcount_popup
                break;
            case 'growing_degreedays':
                popupCloneContent = growingdd_popup
                break;
            case 'growing_season':
                popupCloneContent = growingseason_popup
                break;
            case 'growseason_length':
                popupCloneContent = growseasonlength_popup
                break;
            case 'growseason_range':
                popupCloneContent = growseasonrange_popup
                break;
            case 'heating_degreedays':
                popupCloneContent = heatingdd_popup
                break;
            case 'heatwave_n':
                popupCloneContent = heatwave_popup
                break;
            case 'last_airfrost_doy':
                popupCloneContent = lastairfrost_popup
                break;
            case 'last_grassfrost_doy':
                popupCloneContent = lastgrassfrost_popup
                break;
            case 'p_intensity':
                popupCloneContent = pintensity_popup
                break;
            case 'p_seasonality':
                popupCloneContent = pseasonality_popup
                break;
            case 'personheatstress_count':
                popupCloneContent = personheatstress_popup
                break;
            case 'plantheatstress_count':
                popupCloneContent = plantheatstress_popup
                break;
            case 'start_fieldops_doy':
                popupCloneContent = startfieldops_popup
                break;
            case 'start_grow_doy':
                popupCloneContent = startgrowdoy_popup
                break;
            case 'tempgrowingperiod_length':
                popupCloneContent = tempgrowingperiod_popup
                break;
            case 'thermaltime_sum':
                popupCloneContent = thermaltime_popup
                break;
            case 'wet_count':
                popupCloneContent = wetcount_popup
                break;
            case 'wet_spell_n':
                popupCloneContent = wetspell_popup
                break;
            case 'wettestweek_doy':
                popupCloneContent = wettestweekdoy_popup
                break;
            case 'wettestweek_mm':
                popupCloneContent = wettestweekmm_popup
                break;
        };
        popupTemplateClone.content = popupCloneContent;
        indicatorLayer.popupTemplate = popupTemplateClone;;
    };

    const accumulatedfrost_legend = `Accumulated Frost (degree days): sum of degree days where Tmin < 0\u00B0C`,
        accumulatedfrost_desc = `<h2>Accumulated Frost (degree days)</h2><img src="https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcQXxjIExlTtbSZ1oTG2pOpYswkrrwuAsyFsWg&usqp=CAU"><p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer vitae magna efficitur, tempus lacus facilisis, vestibulum urna. Morbi dignissim pulvinar enim in faucibus. Donec cursus consequat ex. Fusce lacinia faucibus magna in consequat.</p>`,
        accumulatedfrost_popup = `<b>{Raster.ItemPixelValue}</b> degree days in <b>{Year}</b> when the minimum temperature is less than 0\u00B0C`,

        airfrostcount_legend = `Air Frost (count of days): count of days when Tmin < 0\u00B0C`,
        airfrostcount_desc = `<h2>Air Frost (count of days)</h2><p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer vitae magna efficitur, tempus lacus facilisis, vestibulum urna. Morbi dignissim pulvinar enim in faucibus. Donec cursus consequat ex. Fusce lacinia faucibus magna in consequat.</p>`,
        airfrostcount_popup = `<b>{Raster.ItemPixelValue}</b> total days in <b>{Year}</b> when the minimum temperature is less than 0\u00B0C`,

        coldspell_legend = `Cold Spell (count of days): Max count of consecutive days when Tmax < avgTmax (baseline year) - 3\u00B0C (min 6 days)`,
        coldspell_desc = `<h2>Cold Spell (count of days)</h2><p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer vitae magna efficitur, tempus lacus facilisis, vestibulum urna. Morbi dignissim pulvinar enim in faucibus. Donec cursus consequat ex. Fusce lacinia faucibus magna in consequat.</p>        <p>Vestibulum auctor, ipsum vitae fermentum vulputate, mi leo convallis justo, quis elementum sem dui eu nulla. Vestibulum a turpis a sapien facilisis faucibus. In eget nibh luctus, rhoncus lectus et, imperdiet purus. Aliquam sodales sem ut molestieconsequat. In ornare metus porttitor lacinia imperdiet. Donec cursus convallis magna, ut scelerisque magna facilisis eget. Aliquam rutrum, metus ut aliquet vestibulum, lectus lorem gravida nibh, at pulvinar diam risus et sapien. Vivamus necrhoncus erat, a viverra enim. Morbi eu fringilla elit. Nam sed convallis ex, sit amet mattis massa. Ut dui elit, semper id suscipit vitae, rhoncus ac ipsum. Etiam purus risus, vestibulum aliquet ipsum at, interdum consequat risus. Vivamusin quam ut turpis tempor semper. Sed lectus urna, elementum vel sodales a, aliquet eget purus. Suspendisse eget ultrices erat.</p>`,
        coldspell_popup = `<b>{Raster.ItemPixelValue}</b> consecutive days in <b>{Year}</b> when the maximum temperature is less than the average maximum temperature in a baseline year minus 3\u00B0C`,

        drycount_legend = `Dry Count (count of days): count of days when P < 0.2 mm`,
        drycount_desc = ``,
        drycount_popup = `<b>{Raster.ItemPixelValue}</b> total days in <b>{Year}</b> when precipitation is less than 0.2 mm `,

        dryspell_legend = `Dry Spell (count of days): max consecutive count P < 0.2 mm`,
        dryspell_desc = ``,
        dryspell_popup = `<b>{Raster.ItemPixelValue}</b> consecutive days in <b>{Year}</b> when precipitation is less than 0.2 mm`,

        endgrowing_legend = `End of Growing Season (day of year): day when 5 consecutive days Tavg < 5.6\u00B0C from 1 July`,
        endgrowing_desc = ``,
        endgrowing_popup = `<b>{Raster.ItemPixelValue}</b>th day of the year (out of 365) in <b>{Year}</b> when average temperature for five consecutive days is less than 5.6\u00B0C from 1 July`,

        firstairfrost_legend = `First Airfrost (day of year): first day when Tmin < 0\u00B0C from 1 July`,
        firstairfrost_desc = ``,
        firstairfrost_popup = `<b>{Raster.ItemPixelValue}</b>th day of the year (out of 365) in <b>{Year}</b> when the minimum temperature is less than 0\u00B0C from 1 July`,

        firstgrassfrost_legend = `First Grassfrost (day of year): first day when Tmin < 5\u00B0C from 1 July`,
        firstgrassfrost_desc = ``,
        firstgrassfrost_popup = `<b>{Raster.ItemPixelValue}</b>th day of the year (out of 365) in <b>{Year}</b> when the minimum temperature is less than 5\u00B0C from 1 July`,

        grassfrostcount_legend = `Grassfrost (count of days): count of days when Tmin < 5\u00B0C`,
        grassfrostcount_desc = ``,
        grassfrostcount_popup = `<b>{Raster.ItemPixelValue}</b> total days in <b>{Year}</b> when the minimum temperature is less than 5\u00B0C`,

        growingdd_legend = `Growing (degree days): sum Tavg > 5.6\u00B0C`,
        growingdd_desc = ``,
        growingdd_popup = `<b>{Raster.ItemPixelValue}</b> degree days in <b>{Year}</b> when the average temperature is greater than 5.6\u00B0C`,

        growingseason_legend = `Growing Season (count of days): beginning when the temperature on five consecutive days exceeds 5\u00B0C, and ending when the temperature on five consecutive days is below 5\u00B0C`,
        growingseason_desc = ``,
        growingseason_popup = `<b>{Raster.ItemPixelValue}</b> total days in <b>{Year}</b> when the temperature on five consecutive days exceeds 5\u00B0C, and ending when the temperature on five consecutive days is below 5\u00B0C`,

        growseasonlength_legend = `Grow Season Length (count of days): days when Tavg > 5.6\u00B0C between start and end of growing season`,
        growseasonlength_desc = ``,
        growseasonlength_popup = `<b>{Raster.ItemPixelValue}</b> total days in <b>{Year}</b> when the average temperature is greater than 5.6\u00B0C between the start and the end of growing season`,

        growseasonrange_legend = `Grow Season Range (count of days): days between start and end of growing season`,
        growseasonrange_desc = ``,
        growseasonrange_popup = `<b>{Raster.ItemPixelValue}</b> total days in <b>{Year}</b> calculated from the count of days between the start and end of the growing season`,

        heatingdd_legend = `Heating (degree days): Sum of 15.5\u00B0C minus Tavg where Tavg < 15.5\u00B0C`,
        heatingdd_desc = ``,
        heatingdd_popup = `<b>{Raster.ItemPixelValue}</b> degree days in <b>{Year}</b> representing the sum of 15.5\u00B0C minus the average temperature where the average temperature is less than 15.5\u00B0C`,

        heatwave_legend = `Heatwave (count of days): Max count of consecutive days when Tmax > avgTmax (baseline year) + 3\u00B0C (min 6 days)`,
        heatwave_desc = ``,
        heatwave_popup = `<b>{Raster.ItemPixelValue}</b> total days in <b>{Year}</b> when the maximum temperature is greater than the average temperature in a baseline year plus 3\u00B0C`,

        lastairfrost_legend = `Last Airfrost (day of year): last day when Tmin < 0\u00B0C before 1 July`,
        lastairfrost_desc = ``,
        lastairfrost_popup = `<b>{Raster.ItemPixelValue}</b>th day of the year (out of 365) in <b>{Year}</b> when the minimum temperature is less than 0\u00B0C before 1 July`,

        lastgrassfrost_legend = `Last Grassfrost (day of year): last day when Tmin < 5\u00B0C before 1 July`,
        lastgrassfrost_desc = ``,
        lastgrassfrost_popup = `<b>{Raster.ItemPixelValue}</b>th day of the year (out of 365) in <b>{Year}</b> when the minimum temperature is less than 5\u00B0C before 1 July`,

        pintensity_legend = `P Intensity (index): P > 0.2 / count days P > 0.2mm`,
        pintensity_desc = ``,
        pintensity_popup = `<b>{Raster.ItemPixelValue}</b>: index of precipitation intensity in <b>{Year}</b>`,

        pseasonality_legend = `P Seasonality (index): S = winter P - summer P / annual total P`,
        pseasonality_desc = ``,
        pseasonality_popup = `<b>{Raster.ItemPixelValue}</b>: index of precipitation seasonality in <b>{Year}</b>`,

        personheatstress_legend = `Person Heat Stress (count of days): count of days when Tmax > 32\u00B0C`,
        personheatstress_desc = ``,
        personheatstress_popup = `<b>{Raster.ItemPixelValue}</b> total days in <b>{Year}</b> when the maximum temperature is greater than 32\u00B0C`,

        plantheatstress_legend = `Plant Heat Stress (count of days): count of days when Tmax > 25\u00B0C`,
        plantheatstress_desc = `<h2>Plant Heat Stress</h2><img src="http://www.parkwestinc.com/wp-content/uploads/2017/07/193092-131-A181B66B-copy.jpg"><p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer vitae magna efficitur, tempus lacus facilisis, vestibulum urna. Morbi dignissim pulvinar enim in faucibus. Donec cursus consequat ex. Fusce lacinia faucibus magna in consequat. Sed    vitae tellus sit amet dui bibendum porta in sed tellus. Nunc porttitor mollis luctus. Duis ut luctus urna. Vivamus at fermentum eros. Nullam a pulvinar tortor, eu bibendum libero. Integer nec consectetur eros, et dapibus lectus. Nulla sem    nulla, auctor eget lobortis feugiat, ornare sit amet nisl. Donec dolor turpis, feugiat sodales tellus a, vulputate ultrices felis. Quisque lobortis eu turpis molestie fermentum.</p><p>Vestibulum auctor, ipsum vitae fermentum vulputate, mi leo convallis justo, quis elementum sem dui eu nulla. Vestibulum a turpis a sapien facilisis faucibus. In eget nibh luctus, rhoncus lectus et, imperdiet purus. Aliquam sodales sem ut molestie    consequat. In ornare metus porttitor lacinia imperdiet. Donec cursus convallis magna, ut scelerisque magna facilisis eget. Aliquam rutrum, metus ut aliquet vestibulum, lectus lorem gravida nibh, at pulvinar diam risus et sapien. Vivamus nec    rhoncus erat, a viverra enim. Morbi eu fringilla elit. Nam sed convallis ex, sit amet mattis massa. Ut dui elit, semper id suscipit vitae, rhoncus ac ipsum. Etiam purus risus, vestibulum aliquet ipsum at, interdum consequat risus. Vivamus    in quam ut turpis tempor semper. Sed lectus urna, elementum vel sodales a, aliquet eget purus. Suspendisse eget ultrices erat.</p><p>Quisque mattis vulputate metus, et mattis eros lacinia at. Aliquam ac viverra mauris. Duis sit amet sollicitudin elit. Aenean pulvinar convallis felis, quis euismod velit cursus suscipit. Pellentesque mattis molestie imperdiet. Vivamus et risus    quis leo interdum euismod. In augue tortor, pretium vel pharetra ut, accumsan non nulla. Proin ac felis molestie, rutrum enim eu, gravida orci. Etiam rhoncus sit amet ligula dapibus fermentum. Vivamus sagittis id purus vitae semper. Curabitur auctor euismod tortor a aliquam. Sed nisi leo, rutrum et dui in, facilisis convallis risus. Duis ut turpis nunc. Donec facilisis hendrerit est, et dictum justo laoreet eu. Aliquam erat volutpat.</p>`,
        plantheatstress_popup = `<b>{Raster.ItemPixelValue}</b> total days in <b>{Year}</b> when the maximum temperature is greater than 25\u00B0C`,

        startfieldops_legend = `Start FieldOps (day of year): day when Tavg from 1 Jan > 200\u00B0C`,
        startfieldops_desc = ``,
        startfieldops_popup = `<b>{Raster.ItemPixelValue}</b>th day of the year (out of 365) in <b>{Year}</b> when the sum of the daily average temperatures from 1 Jan is greater than 200\u00B0C`,

        startgrowdoy_legend = `Start Grow (day of year): day when 5 consecutve days Tavg > 5.6\u00B0C`,
        startgrowdoy_desc = ``,
        startgrowdoy_popup = `<b>{Raster.ItemPixelValue}</b>th day of the year (out of 365) in <b>{Year}</b> when five consecutive days have an average temperature greater than 5.6\u00B0C`,

        tempgrowingperiod_legend = `Temp Growing Period (count of days): count of days between average 5 day temp > 5\u00B0C and average 5 day temp < 5\u00B0C where average daily temp greater than 5\u00B0C`,
        tempgrowingperiod_desc = ``,
        tempgrowingperiod_popup = `<b>{Raster.ItemPixelValue}</b> total days in <b>{Year}</b> between when the average five-day temperature is greater than 5\u00B0C and when the average five-day temperature is less than 5\u00B0C`,

        thermaltime_legend = `Thermal Time (degree days): sum of day degrees for period from 5th of 5 day period where Tavg greater than 5\u00B0C to end point where Tavg less than 5\u00B0C`,
        thermaltime_desc = ``,
        thermaltime_popup = `<b>{Raster.ItemPixelValue}</b> degree days in <b>{Year}</b> for the period from fifth day of a five-day period where the average temperater is greater than 5\u00B0C to the end point when the average temperature is less than 5\u00B0C`,

        wetcount_legend = `Wet Count (count of days): days when P >= 0.2 mm`,
        wetcount_desc = ``,
        wetcount_popup = `<b>{Raster.ItemPixelValue}</b> total wet days in <b>{Year}</b> when precipitation is greater than or equal to 0.2 mm`,

        wetspell_legend = `Wet Spell (count of days): max consecutive count P > 0.2 mm`,
        wetspell_desc = ``,
        wetspell_popup = `<b>{Raster.ItemPixelValue}</b> total days in <b>{Year}</b> when the maximum consecutive count of precipitation is greater than 0.2 mm`,

        wettestweekdoy_legend = `Wettest Week (day of year): mid-week date when maximum 7d value of P occurs`,
        wettestweekdoy_desc = ``,
        wettestweekdoy_popup = `<b>{Raster.ItemPixelValue}</b>th day of the year (out of 365) in <b>{Year}</b> when the maximum seven-day value of precipitation occurs`,

        wettestweekmm_legend = `Wettest Week (mm): Maximum amount of P (7 consecutive days)`,
        wettestweekmm_desc = ``,
        wettestweekmm_popup = `<b>{Raster.ItemPixelValue}</b> mm of precipitation in <b>{Year}</b> calculated from the maximum amount of precipitation in seven consecutive days`
});