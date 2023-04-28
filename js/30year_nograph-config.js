'use strict'; // https://javascript.info/strict-mode for explanation

function toggleDescription() {
    const hideaway = document.getElementById("hideaway");
    const frame = document.getElementById("frame");
    const button = document.getElementById("button");

    if (hideaway.style.display === "none") {
        hideaway.style.display = "block";
        button.innerHTML = "&#x25BC; Hide Info";
        frame.style.width = "70%";
    } else {
        hideaway.style.display = "none";
        frame.style.width = "100%";
        button.innerHTML = "&#x25B2; Show Info";
    }
};

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

    const accumulatedfrost_legend = `Accumulated Frost (degree days): sum of degree days where Tmin < 0\u00B0C`,
        accumulatedfrost_desc = `<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer vitae magna efficitur, tempus lacus facilisis, vestibulum urna. Morbi dignissim pulvinar enim in faucibus. Donec cursus consequat ex. Fusce lacinia faucibus magna in consequat.</p>`,
        accumulatedfrost_popup = `<b>{Raster.ItemPixelValue}</b> degree days in <b>{Year}</b> when the minimum temperature is less than 0\u00B0C`,

        airfrostcount_legend = `Air Frost (count of days): count of days when Tmin < 0\u00B0C`,
        airfrostcount_desc = `<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer vitae magna efficitur, tempus lacus facilisis, vestibulum urna. Morbi dignissim pulvinar enim in faucibus. Donec cursus consequat ex. Fusce lacinia faucibus magna in consequat.</p>`,
        airfrostcount_popup = `<b>{Raster.ItemPixelValue}</b> total days in <b>{Year}</b> when the minimum temperature is less than 0\u00B0C`,

        coldspell_legend = `Cold Spell (count of days): Max count of consecutive days when Tmax < avgTmax (baseline year) - 3\u00B0C (min 6 days)`,
        coldspell_desc = `<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer vitae magna efficitur, tempus lacus facilisis, vestibulum urna. Morbi dignissim pulvinar enim in faucibus. Donec cursus consequat ex. Fusce lacinia faucibus magna in consequat.</p>`,
        coldspell_popup = `<b>{Raster.ItemPixelValue}</b> consecutive days in <b>{Year}</b> when the maximum temperature is less than the average maximum temperature in a baseline year minus 3\u00B0C`,

        drycount_legend = `Dry Count (count of days): count of days when P < 0.2 mm`,
        drycount_desc = `<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer vitae magna efficitur, tempus lacus facilisis, vestibulum urna. Morbi dignissim pulvinar enim in faucibus. Donec cursus consequat ex. Fusce lacinia faucibus magna in consequat.</p>`,
        drycount_popup = `<b>{Raster.ItemPixelValue}</b> total days in <b>{Year}</b> when precipitation is less than 0.2 mm `,

        dryspell_legend = `Dry Spell (count of days): max consecutive count P < 0.2 mm`,
        dryspell_desc = `<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer vitae magna efficitur, tempus lacus facilisis, vestibulum urna. Morbi dignissim pulvinar enim in faucibus. Donec cursus consequat ex. Fusce lacinia faucibus magna in consequat.</p>`,
        dryspell_popup = `<b>{Raster.ItemPixelValue}</b> consecutive days in <b>{Year}</b> when precipitation is less than 0.2 mm`,

        endgrowing_legend = `End of Growing Season (day of year): day when 5 consecutive days Tavg < 5.6\u00B0C from 1 July`,
        endgrowing_desc = `<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer vitae magna efficitur, tempus lacus facilisis, vestibulum urna. Morbi dignissim pulvinar enim in faucibus. Donec cursus consequat ex. Fusce lacinia faucibus magna in consequat.</p>`,
        endgrowing_popup = `<b>{Raster.ItemPixelValue}</b>th day of the year (out of 365) in <b>{Year}</b> when average temperature for five consecutive days is less than 5.6\u00B0C from 1 July`,

        firstairfrost_legend = `First Airfrost (day of year): first day when Tmin < 0\u00B0C from 1 July`,
        firstairfrost_desc = `<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer vitae magna efficitur, tempus lacus facilisis, vestibulum urna. Morbi dignissim pulvinar enim in faucibus. Donec cursus consequat ex. Fusce lacinia faucibus magna in consequat.</p>`,
        firstairfrost_popup = `<b>{Raster.ItemPixelValue}</b>th day of the year (out of 365) in <b>{Year}</b> when the minimum temperature is less than 0\u00B0C from 1 July`,

        firstgrassfrost_legend = `First Grassfrost (day of year): first day when Tmin < 5\u00B0C from 1 July`,
        firstgrassfrost_desc = `<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer vitae magna efficitur, tempus lacus facilisis, vestibulum urna. Morbi dignissim pulvinar enim in faucibus. Donec cursus consequat ex. Fusce lacinia faucibus magna in consequat.</p>`,
        firstgrassfrost_popup = `<b>{Raster.ItemPixelValue}</b>th day of the year (out of 365) in <b>{Year}</b> when the minimum temperature is less than 5\u00B0C from 1 July`,

        grassfrostcount_legend = `Grassfrost (count of days): count of days when Tmin < 5\u00B0C`,
        grassfrostcount_desc = `<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer vitae magna efficitur, tempus lacus facilisis, vestibulum urna. Morbi dignissim pulvinar enim in faucibus. Donec cursus consequat ex. Fusce lacinia faucibus magna in consequat.</p>`,
        grassfrostcount_popup = `<b>{Raster.ItemPixelValue}</b> total days in <b>{Year}</b> when the minimum temperature is less than 5\u00B0C`,

        growingdd_legend = `Growing (degree days): sum Tavg > 5.6\u00B0C`,
        growingdd_desc = `<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer vitae magna efficitur, tempus lacus facilisis, vestibulum urna. Morbi dignissim pulvinar enim in faucibus. Donec cursus consequat ex. Fusce lacinia faucibus magna in consequat.</p>`,
        growingdd_popup = `<b>{Raster.ItemPixelValue}</b> degree days in <b>{Year}</b> when the average temperature is greater than 5.6\u00B0C`,

        growingseason_legend = `Growing Season (count of days): beginning when the temperature on five consecutive days exceeds 5\u00B0C, and ending when the temperature on five consecutive days is below 5\u00B0C`,
        growingseason_desc = `<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer vitae magna efficitur, tempus lacus facilisis, vestibulum urna. Morbi dignissim pulvinar enim in faucibus. Donec cursus consequat ex. Fusce lacinia faucibus magna in consequat.</p>`,
        growingseason_popup = `<b>{Raster.ItemPixelValue}</b> total days in <b>{Year}</b> when the temperature on five consecutive days exceeds 5\u00B0C, and ending when the temperature on five consecutive days is below 5\u00B0C`,

        growseasonlength_legend = `Grow Season Length (count of days): days when Tavg > 5.6\u00B0C between start and end of growing season`,
        growseasonlength_desc = `<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer vitae magna efficitur, tempus lacus facilisis, vestibulum urna. Morbi dignissim pulvinar enim in faucibus. Donec cursus consequat ex. Fusce lacinia faucibus magna in consequat.</p>`,
        growseasonlength_popup = `<b>{Raster.ItemPixelValue}</b> total days in <b>{Year}</b> when the average temperature is greater than 5.6\u00B0C between the start and the end of growing season`,

        growseasonrange_legend = `Grow Season Range (count of days): days between start and end of growing season`,
        growseasonrange_desc = `<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer vitae magna efficitur, tempus lacus facilisis, vestibulum urna. Morbi dignissim pulvinar enim in faucibus. Donec cursus consequat ex. Fusce lacinia faucibus magna in consequat.</p>`,
        growseasonrange_popup = `<b>{Raster.ItemPixelValue}</b> total days in <b>{Year}</b> calculated from the count of days between the start and end of the growing season`,

        heatingdd_legend = `Heating (degree days): Sum of 15.5\u00B0C minus Tavg where Tavg < 15.5\u00B0C`,
        heatingdd_desc = `<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer vitae magna efficitur, tempus lacus facilisis, vestibulum urna. Morbi dignissim pulvinar enim in faucibus. Donec cursus consequat ex. Fusce lacinia faucibus magna in consequat.</p>`,
        heatingdd_popup = `<b>{Raster.ItemPixelValue}</b> degree days in <b>{Year}</b> representing the sum of 15.5\u00B0C minus the average temperature where the average temperature is less than 15.5\u00B0C`,

        heatwave_legend = `Heatwave (count of days): Max count of consecutive days when Tmax > avgTmax (baseline year) + 3\u00B0C (min 6 days)`,
        heatwave_desc = `<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer vitae magna efficitur, tempus lacus facilisis, vestibulum urna. Morbi dignissim pulvinar enim in faucibus. Donec cursus consequat ex. Fusce lacinia faucibus magna in consequat.</p>`,
        heatwave_popup = `<b>{Raster.ItemPixelValue}</b> total days in <b>{Year}</b> when the maximum temperature is greater than the average temperature in a baseline year plus 3\u00B0C`,

        lastairfrost_legend = `Last Airfrost (day of year): last day when Tmin < 0\u00B0C before 1 July`,
        lastairfrost_desc = `<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer vitae magna efficitur, tempus lacus facilisis, vestibulum urna. Morbi dignissim pulvinar enim in faucibus. Donec cursus consequat ex. Fusce lacinia faucibus magna in consequat.</p>`,
        lastairfrost_popup = `<b>{Raster.ItemPixelValue}</b>th day of the year (out of 365) in <b>{Year}</b> when the minimum temperature is less than 0\u00B0C before 1 July`,

        lastgrassfrost_legend = `Last Grassfrost (day of year): last day when Tmin < 5\u00B0C before 1 July`,
        lastgrassfrost_desc = `<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer vitae magna efficitur, tempus lacus facilisis, vestibulum urna. Morbi dignissim pulvinar enim in faucibus. Donec cursus consequat ex. Fusce lacinia faucibus magna in consequat.</p>`,
        lastgrassfrost_popup = `<b>{Raster.ItemPixelValue}</b>th day of the year (out of 365) in <b>{Year}</b> when the minimum temperature is less than 5\u00B0C before 1 July`,

        pintensity_legend = `P Intensity (index): P > 0.2 / count days P > 0.2mm`,
        pintensity_desc = `<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer vitae magna efficitur, tempus lacus facilisis, vestibulum urna. Morbi dignissim pulvinar enim in faucibus. Donec cursus consequat ex. Fusce lacinia faucibus magna in consequat.</p>`,
        pintensity_popup = `<b>{Raster.ItemPixelValue}</b>: index of precipitation intensity in <b>{Year}</b>`,

        pseasonality_legend = `P Seasonality (index): S = winter P - summer P / annual total P`,
        pseasonality_desc = `<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer vitae magna efficitur, tempus lacus facilisis, vestibulum urna. Morbi dignissim pulvinar enim in faucibus. Donec cursus consequat ex. Fusce lacinia faucibus magna in consequat.</p>`,
        pseasonality_popup = `<b>{Raster.ItemPixelValue}</b>: index of precipitation seasonality in <b>{Year}</b>`,

        personheatstress_legend = `Person Heat Stress (count of days): count of days when Tmax > 32\u00B0C`,
        personheatstress_desc = `<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer vitae magna efficitur, tempus lacus facilisis, vestibulum urna. Morbi dignissim pulvinar enim in faucibus. Donec cursus consequat ex. Fusce lacinia faucibus magna in consequat.</p>`,
        personheatstress_popup = `<b>{Raster.ItemPixelValue}</b> total days in <b>{Year}</b> when the maximum temperature is greater than 32\u00B0C`,

        plantheatstress_legend = `Plant Heat Stress (count of days): count of days when Tmax > 25\u00B0C`,
        plantheatstress_desc = `<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer vitae magna efficitur, tempus lacus facilisis, vestibulum urna. Morbi dignissim pulvinar enim in faucibus. Donec cursus consequat ex. Fusce lacinia faucibus magna in consequat.</p>`,
        plantheatstress_popup = `<b>{Raster.ItemPixelValue}</b> total days in <b>{Year}</b> when the maximum temperature is greater than 25\u00B0C`,

        startfieldops_legend = `Start FieldOps (day of year): day when Tavg from 1 Jan > 200\u00B0C`,
        startfieldops_desc = `<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer vitae magna efficitur, tempus lacus facilisis, vestibulum urna. Morbi dignissim pulvinar enim in faucibus. Donec cursus consequat ex. Fusce lacinia faucibus magna in consequat.</p>`,
        startfieldops_popup = `<b>{Raster.ItemPixelValue}</b>th day of the year (out of 365) in <b>{Year}</b> when the sum of the daily average temperatures from 1 Jan is greater than 200\u00B0C`,

        startgrowdoy_legend = `Start Grow (day of year): day when 5 consecutve days Tavg > 5.6\u00B0C`,
        startgrowdoy_desc = `<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer vitae magna efficitur, tempus lacus facilisis, vestibulum urna. Morbi dignissim pulvinar enim in faucibus. Donec cursus consequat ex. Fusce lacinia faucibus magna in consequat.</p>`,
        startgrowdoy_popup = `<b>{Raster.ItemPixelValue}</b>th day of the year (out of 365) in <b>{Year}</b> when five consecutive days have an average temperature greater than 5.6\u00B0C`,

        tempgrowingperiod_legend = `Temp Growing Period (count of days): count of days between average 5 day temp > 5\u00B0C and average 5 day temp < 5\u00B0C where average daily temp greater than 5\u00B0C`,
        tempgrowingperiod_desc = `<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer vitae magna efficitur, tempus lacus facilisis, vestibulum urna. Morbi dignissim pulvinar enim in faucibus. Donec cursus consequat ex. Fusce lacinia faucibus magna in consequat.</p>`,
        tempgrowingperiod_popup = `<b>{Raster.ItemPixelValue}</b> total days in <b>{Year}</b> between when the average five-day temperature is greater than 5\u00B0C and when the average five-day temperature is less than 5\u00B0C`,

        thermaltime_legend = `Thermal Time (degree days): sum of day degrees for period from 5th of 5 day period where Tavg greater than 5\u00B0C to end point where Tavg less than 5\u00B0C`,
        thermaltime_desc = `<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer vitae magna efficitur, tempus lacus facilisis, vestibulum urna. Morbi dignissim pulvinar enim in faucibus. Donec cursus consequat ex. Fusce lacinia faucibus magna in consequat.</p>`,
        thermaltime_popup = `<b>{Raster.ItemPixelValue}</b> degree days in <b>{Year}</b> for the period from fifth day of a five-day period where the average temperater is greater than 5\u00B0C to the end point when the average temperature is less than 5\u00B0C`,

        wetcount_legend = `Wet Count (count of days): days when P >= 0.2 mm`,
        wetcount_desc = `<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer vitae magna efficitur, tempus lacus facilisis, vestibulum urna. Morbi dignissim pulvinar enim in faucibus. Donec cursus consequat ex. Fusce lacinia faucibus magna in consequat.</p>`,
        wetcount_popup = `<b>{Raster.ItemPixelValue}</b> total wet days in <b>{Year}</b> when precipitation is greater than or equal to 0.2 mm`,

        wetspell_legend = `Wet Spell (count of days): max consecutive count P > 0.2 mm`,
        wetspell_desc = `<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer vitae magna efficitur, tempus lacus facilisis, vestibulum urna. Morbi dignissim pulvinar enim in faucibus. Donec cursus consequat ex. Fusce lacinia faucibus magna in consequat.</p>`,
        wetspell_popup = `<b>{Raster.ItemPixelValue}</b> total days in <b>{Year}</b> when the maximum consecutive count of precipitation is greater than 0.2 mm`,

        wettestweekdoy_legend = `Wettest Week (day of year): mid-week date when maximum 7d value of P occurs`,
        wettestweekdoy_desc = `<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer vitae magna efficitur, tempus lacus facilisis, vestibulum urna. Morbi dignissim pulvinar enim in faucibus. Donec cursus consequat ex. Fusce lacinia faucibus magna in consequat.</p>`,
        wettestweekdoy_popup = `<b>{Raster.ItemPixelValue}</b>th day of the year (out of 365) in <b>{Year}</b> when the maximum seven-day value of precipitation occurs`,

        wettestweekmm_legend = `Wettest Week (mm): Maximum amount of P (7 consecutive days)`,
        wettestweekmm_desc = `<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer vitae magna efficitur, tempus lacus facilisis, vestibulum urna. Morbi dignissim pulvinar enim in faucibus. Donec cursus consequat ex. Fusce lacinia faucibus magna in consequat.</p>`,
        wettestweekmm_popup = `<b>{Raster.ItemPixelValue}</b> mm of precipitation in <b>{Year}</b> calculated from the maximum amount of precipitation in seven consecutive days`

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
        center: new Point({ x: 200000, y: 785000, spatialReference: 27700 }), // reprojected to allow OS basemap
        zoom: 6.5
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

    // set initial variable and dimension on mosaic dataset
    const yearDefinitionLeft = new DimensionalDefinition({
        variableName: 'plantheatstress_count',
        dimensionName: 'Year',
        values: [1961],
        isSlice: true
    });

    // create mosaicRule and set multidimensionalDefinition
    let mosaicRuleLeft = new MosaicRule({
        multidimensionalDefinition: [yearDefinitionLeft]
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

    //function to popupTemplate if open
    const closePopup = () => {
        if (view.popup.visible) {
            view.popup.close()
        }
    };

    // create and add imagery layer to view
    const indicatorLayer = new ImageryLayer({
        title: [], //The legend automatically updates when a layer's renderer, opacity, or title is changed
        url: 'https://abgis03.hutton.ac.uk:6443/arcgis/rest/services/Agmet/Ensemble5/ImageServer',
        mosaicRule: mosaicRuleLeft,
        renderer: countOfDayRenderer,
        renderingRule: serviceRasterFunctionLeft,
        popupTemplate: indicatorLayerPopupTemplate,
        opacity: 0.9
    });
    map.add(indicatorLayer);

    /******************************
     * programmatically make selectors 
     *******************************/
    const selectorExpression = [
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
    const selectDivs = [selectDivLeft] //, selectDivRight]

    selectDivs.forEach(element => {
        element.setAttribute('id', 'selectDivLeft');
        element.setAttribute('class', 'esri-widget');
        element.setAttribute('style', 'padding: 0 10px 10px 10px;background-color:white;');
        element.setAttribute('title', `Select Agrometeorological Indicator to display on the map`) // tooltip
    });

    selectDivLeft.innerHTML = '<p>Select Agrometeorological Indicator:<p>';

    const selectFilterLeft = document.createElement('select');
    const selectFilters = [selectFilterLeft] //, selectFilterRight];

    selectFilters.forEach(element => {
        element.setAttribute('id', 'selectFilterLeft');
        element.setAttribute('class', 'esri-widget');
        element.setAttribute('style', 'width: 280px;')
    })

    selectDivLeft.appendChild(selectFilterLeft);

    // make options and add labels for each 
    selectorExpression.forEach(element => {
        let option = document.createElement('option');
        option.value = element[0];
        option.innerHTML = element[1];

        selectFilterLeft.appendChild(option);
    });

    // make plantheatstress_count selected 
    selectFilterLeft.value = 'plantheatstress_count';

    // add selectDivs to view
    view.ui.add(selectDivLeft, 'top-left');

    /******************************
     * selectorDiv configs
     * ****************************/
    //listen to change events on indicatorSelect and change multidimensional variable
    selectFilterLeft.addEventListener('change', () => {
        const chosenIndicator = selectFilterLeft.value;
        changeIndicator(chosenIndicator);
        changeDescriptors(chosenIndicator);
        stopAnimation();
    });

    function changeIndicator(chosenIndicator) {
        closePopup();

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
            // values: [1990, 2000, 2010, 2020, 2030, 2040, 2050, 2060, 2070],
            mode: 'count',
            values: 1100,
            labelsVisible: false,
        }]
    });

    // when the user changes the yearSlider's value, change the year to reflect data
    yearSlider.on(['thumb-change', 'thumb-drag'], event => {
        closePopup();
        stopAnimation();
        updateYearDef(event.value);
    });

    // read all other values when year updates
    function updateYearDef() {
        const mosaicRuleClone = indicatorLayer.mosaicRule.clone(); // makes clone of layer's mosaicRule
        const yearVariable = mosaicRuleClone.multidimensionalDefinition[0];
        yearVariable.values = yearSlider.get('values');
        mosaicRuleClone.multidimensionalDefinition = [yearVariable];
        indicatorLayer.mosaicRule = mosaicRuleClone;
    };

    // set var for play button 
    const playButton = document.getElementById('playButton');

    // Toggle animation on/off when user
    // clicks on the play button
    playButton.addEventListener('click', () => {
        closePopup();
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
                if (indicatorLayer.mosaicRule.multidimensionalDefinition[0].values[0] == year) {
                    year += 1;
                } // check if year has loaded on map
                if (year > yearSlider.max) {
                    year = yearSlider.min;
                }
                yearSlider.values = [year];
                updateYearDef(year);
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
    view.ui.move('zoom', 'bottom-left');

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
    view.ui.add(home, 'bottom-left');
    view.ui.add(scaleBar, 'bottom-right')

    // create and add legend to view 
    const legend = new Legend({
        view: view,
        layerInfos: [{
            layer: indicatorLayer,
            title: [`Plant Heat Stress: count of days when Tmax > 25\u00B0C`]
        }],
        title: 'Click anywhere on the map to find out the data value for that pixel'
    });

    view.ui.add(legend, 'top-left');

    //add tooltip to legend
    let legendTooltip = () => {
        let legendClass = document.getElementsByClassName('esri-legend')[0];
        legendClass.setAttribute('title', `Click anywhere on the map to get the data's pixel value`)
    };
    setTimeout(legendTooltip, 1000);

    /******************************
     * Lengthy Configs
     *******************************/

    // change title of layer for Legend display
    // change innerHTML of hideaway div
    // change popup contents
    function changeDescriptors(chosenIndicator) {
        const hideaway = document.getElementById("hideaway");

        const HTML30yrmaps = `<div id='imgGrid'><div><p>1961-1990 Average</p><img src='img/` + chosenIndicator + `_1961-1990_observed_scotland.png'></div>
        <div><p>1991-2018 Average</p><img src='img/` + chosenIndicator + `_1991-2018_observed_scotland.png'></div>
        <div><p>2019-2050 Average</p><img src='img/` + chosenIndicator + `_2019-2050_ensemblemean_scotland.png'></div>
        <div><p>2051-2080 Average</p><img src='img/` + chosenIndicator + `_2051-2080_ensemblemean_scotland.png'></div></div>`

        const popupTemplateClone = indicatorLayer.popupTemplate.clone();
        let popupCloneContent = popupTemplateClone.content;

        switch (chosenIndicator) {
            case 'accumulatedfrost_degreedays':
                indicatorLayer.title = accumulatedfrost_legend
                hideaway.innerHTML = `<h2>` + selectorExpression[0][1] + `</h2>` + HTML30yrmaps + accumulatedfrost_desc
                popupCloneContent = accumulatedfrost_popup
                break;
            case 'airfrost_count':
                indicatorLayer.title = airfrostcount_legend
                hideaway.innerHTML = `<h2>` + selectorExpression[1][1] + `</h2>` + HTML30yrmaps + airfrostcount_desc
                popupCloneContent = airfrostcount_popup
                break;
            case 'cold_spell_n':
                indicatorLayer.title = coldspell_legend
                hideaway.innerHTML = `<h2>` + selectorExpression[2][1] + `</h2>` + HTML30yrmaps + coldspell_desc
                popupCloneContent = coldspell_popup
                break;
            case 'dry_count':
                indicatorLayer.title = drycount_legend
                hideaway.innerHTML = `<h2>` + selectorExpression[3][1] + `</h2>` + HTML30yrmaps + drycount_desc
                popupCloneContent = drycount_popup
                break;
            case 'dry_spell_n':
                indicatorLayer.title = dryspell_legend
                hideaway.innerHTML = `<h2>` + selectorExpression[4][1] + `</h2>` + HTML30yrmaps + dryspell_desc
                popupCloneContent = dryspell_popup
                break;
            case 'end_growingseason':
                indicatorLayer.title = endgrowing_legend
                hideaway.innerHTML = `<h2>` + selectorExpression[5][1] + `</h2>` + HTML30yrmaps + endgrowing_desc
                popupCloneContent = endgrowing_popup
                break;
            case 'first_airfrost_doy':
                indicatorLayer.title = firstairfrost_legend
                hideaway.innerHTML = `<h2>` + selectorExpression[6][1] + `</h2>` + HTML30yrmaps + firstairfrost_desc
                popupCloneContent = firstairfrost_popup
                break;
            case 'first_grassfrost_doy':
                indicatorLayer.title = firstgrassfrost_legend
                hideaway.innerHTML = `<h2>` + selectorExpression[7][1] + `</h2>` + HTML30yrmaps + firstgrassfrost_desc
                popupCloneContent = firstgrassfrost_popup
                break;
            case 'grassfrost_count':
                indicatorLayer.title = grassfrostcount_legend
                hideaway.innerHTML = `<h2>` + selectorExpression[8][1] + `</h2>` + HTML30yrmaps + grassfrostcount_desc
                popupCloneContent = grassfrostcount_popup
                break;
            case 'growing_degreedays':
                indicatorLayer.title = growingdd_legend
                hideaway.innerHTML = `<h2>` + selectorExpression[9][1] + `</h2>` + HTML30yrmaps + growingdd_desc
                popupCloneContent = growingdd_popup
                break;
            case 'growing_season':
                indicatorLayer.title = growingseason_legend
                hideaway.innerHTML = `<h2>` + selectorExpression[10][1] + `</h2>` + HTML30yrmaps + growingseason_desc
                popupCloneContent = growingseason_popup
                break;
            case 'growseason_length':
                indicatorLayer.title = growseasonlength_legend
                hideaway.innerHTML = `<h2>` + selectorExpression[11][1] + `</h2>` + HTML30yrmaps + growseasonlength_desc
                popupCloneContent = growseasonlength_popup
                break;
            case 'growseason_range':
                indicatorLayer.title = growseasonrange_legend
                hideaway.innerHTML = `<h2>` + selectorExpression[12][1] + `</h2>` + HTML30yrmaps + growseasonrange_desc
                popupCloneContent = growseasonrange_popup
                break;
            case 'heating_degreedays':
                indicatorLayer.title = heatingdd_legend
                hideaway.innerHTML = `<h2>` + selectorExpression[13][1] + `</h2>` + HTML30yrmaps + heatingdd_desc
                popupCloneContent = heatingdd_popup
                break;
            case 'heatwave_n':
                indicatorLayer.title = heatwave_legend
                hideaway.innerHTML = `<h2>` + selectorExpression[14][1] + `</h2>` + HTML30yrmaps + heatwave_desc
                popupCloneContent = heatwave_popup
                break;
            case 'last_airfrost_doy':
                indicatorLayer.title = lastairfrost_legend
                hideaway.innerHTML = `<h2>` + selectorExpression[15][1] + `</h2>` + HTML30yrmaps + lastairfrost_desc
                popupCloneContent = lastairfrost_popup
                break;
            case 'last_grassfrost_doy':
                indicatorLayer.title = lastgrassfrost_legend
                hideaway.innerHTML = `<h2>` + selectorExpression[16][1] + `</h2>` + HTML30yrmaps + lastgrassfrost_desc
                popupCloneContent = lastgrassfrost_popup
                break;
            case 'p_intensity':
                indicatorLayer.title = pintensity_legend
                hideaway.innerHTML = `<h2>` + selectorExpression[17][1] + `</h2>` + HTML30yrmaps + pintensity_desc
                popupCloneContent = pintensity_popup
                break;
            case 'p_seasonality':
                indicatorLayer.title = pseasonality_legend
                hideaway.innerHTML = `<h2>` + selectorExpression[18][1] + `</h2>` + HTML30yrmaps + pseasonality_desc
                popupCloneContent = pseasonality_popup
                break;
            case 'personheatstress_count':
                indicatorLayer.title = personheatstress_legend
                hideaway.innerHTML = `<h2>` + selectorExpression[19][1] + `</h2>` + HTML30yrmaps + personheatstress_desc
                popupCloneContent = personheatstress_popup
                break;
            case 'plantheatstress_count':
                indicatorLayer.title = plantheatstress_legend
                hideaway.innerHTML = `<h2>` + selectorExpression[20][1] + `</h2>` + HTML30yrmaps + plantheatstress_desc
                popupCloneContent = plantheatstress_popup
                break;
            case 'start_fieldops_doy':
                indicatorLayer.title = startfieldops_legend
                hideaway.innerHTML = `<h2>` + selectorExpression[21][1] + `</h2>` + HTML30yrmaps + startfieldops_desc
                popupCloneContent = startfieldops_popup
                break;
            case 'start_grow_doy':
                indicatorLayer.title = startgrowdoy_legend
                hideaway.innerHTML = `<h2>` + selectorExpression[22][1] + `</h2>` + HTML30yrmaps + startgrowdoy_desc
                popupCloneContent = startgrowdoy_popup
                break;
            case 'tempgrowingperiod_length':
                indicatorLayer.title = tempgrowingperiod_legend
                hideaway.innerHTML = `<h2>` + selectorExpression[23][1] + `</h2>` + HTML30yrmaps + tempgrowingperiod_desc
                popupCloneContent = tempgrowingperiod_popup
                break;
            case 'thermaltime_sum':
                indicatorLayer.title = thermaltime_legend
                hideaway.innerHTML = `<h2>` + selectorExpression[24][1] + `</h2>` + HTML30yrmaps + thermaltime_desc
                popupCloneContent = thermaltime_popup
                break;
            case 'wet_count':
                indicatorLayer.title = wetcount_legend
                hideaway.innerHTML = `<h2>` + selectorExpression[25][1] + `</h2>` + HTML30yrmaps + wetcount_desc
                popupCloneContent = wetcount_popup
                break;
            case 'wet_spell_n':
                indicatorLayer.title = wetspell_legend
                hideaway.innerHTML = `<h2>` + selectorExpression[26][1] + `</h2>` + HTML30yrmaps + wetspell_desc
                popupCloneContent = wetspell_popup
                break;
            case 'wettestweek_doy':
                indicatorLayer.title = wettestweekdoy_legend
                hideaway.innerHTML = `<h2>` + selectorExpression[27][1] + `</h2>` + HTML30yrmaps + wettestweekdoy_desc
                popupCloneContent = wettestweekdoy_popup
                break;
            case 'wettestweek_mm':
                indicatorLayer.title = wettestweekmm_legend
                hideaway.innerHTML = `<h2>` + selectorExpression[28][1] + `</h2>` + HTML30yrmaps + wettestweekmm_desc
                popupCloneContent = wettestweekmm_popup
                break;
        };
        popupTemplateClone.content = popupCloneContent;
        indicatorLayer.popupTemplate = popupTemplateClone;;
    };
});