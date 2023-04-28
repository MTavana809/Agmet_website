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
    'esri/layers/ImageryLayer',
    'esri/layers/support/RasterFunction',
    'esri/layers/support/MosaicRule',
    'esri/layers/support/DimensionalDefinition',
    'esri/layers/MapImageLayer',
    'esri/renderers/RasterStretchRenderer',
    'esri/rest/support/AlgorithmicColorRamp', // moved from esri/tasks/support after 4.19 // bug after 4.21
    'esri/rest/support/MultipartColorRamp', // moved from esri/tasks/support after 4.19
    'esri/rest/support/ImageHistogramParameters', // moved from esri/tasks/support after 4.19
    'esri/popup/content/LineChartMediaInfo'
], (Map,
    Basemap,
    Point,
    MapView,
    ScaleBar,
    Slider,
    Home,
    Legend,
    ImageryLayer,
    RasterFunction,
    MosaicRule,
    DimensionalDefinition,
    MapImageLayer,
    RasterStretchRenderer,
    AlgorithmicColorRamp,
    MultipartColorRamp,
    ImageHistogramParameters,
    LineChartMediaInfo) => {

    // new basemap definition
    const basemap = new Basemap({
        portalItem: {
            id: '54140d826fe34135abb3b60c157170dc' // os_open_greyscale_no_labels
        }
    });

    // create map
    const map = new Map({
        basemap: basemap,
        layers: [] // add layers later
    });

    // create 2D view for the Map
    const view = new MapView({
        container: 'mapDiv',
        map: map,
        //extent: new Extent({xmin: -500, ymin: 7500, xmax: 656500, ymax: 1218500, spatialReference: 2770}) //,
        center: new Point({ x: 250000, y: 520000, spatialReference: 27700 }), // reprojected to allow OS basemap
        scale: 5500000
        //zoom: 6.5
    });

    /******************************
     * Renderers for Layers -- aka symbology
     * ****************************/

    // create renderer for countOfDay
    const colorRamp1 = new AlgorithmicColorRamp({
        algorithm: 'lab-lch',
        fromColor: '#006837',
        toColor: '#1A9850'
    });
    const colorRamp2 = new AlgorithmicColorRamp({
        algorithm: 'lab-lch',
        fromColor: '#1A9850',
        toColor: '#66BD63'
    });
    const colorRamp3 = new AlgorithmicColorRamp({
        algorithm: 'lab-lch',
        fromColor: '#66BD63',
        toColor: '#A6D96A'
    });
    const colorRamp4 = new AlgorithmicColorRamp({
        algorithm: 'lab-lch',
        fromColor: '#A6D96A',
        toColor: '#D9EF8B'
    });
    const colorRamp5 = new AlgorithmicColorRamp({
        algorithm: 'lab-lch',
        fromColor: '#D9EF8B',
        toColor: '#FFFFBF'
    });
    const colorRamp6 = new AlgorithmicColorRamp({
        algorithm: 'lab-lch',
        fromColor: '#FFFFBF',
        toColor: '#FEE08B'
    });
    const colorRamp7 = new AlgorithmicColorRamp({
        algorithm: 'lab-lch',
        fromColor: '#FEE08B',
        toColor: '#FDAE61'
    });
    const colorRamp8 = new AlgorithmicColorRamp({
        algorithm: 'lab-lch',
        fromColor: '#FDAE61',
        toColor: '#F46D43'
    });
    const colorRamp9 = new AlgorithmicColorRamp({
        algorithm: 'lab-lch',
        fromColor: '#F46D43',
        toColor: '#D73027'
    });
    const colorRamp10 = new AlgorithmicColorRamp({
        algorithm: 'lab-lch',
        fromColor: '#D73027',
        toColor: '#A50026'
    });

    const combineColorRamp = new MultipartColorRamp({
        colorRamps: [colorRamp1, colorRamp2, colorRamp3, colorRamp4, colorRamp5, colorRamp6,
            colorRamp7, colorRamp8, colorRamp9, colorRamp10]
    });

    const countOfDayRenderer = new RasterStretchRenderer({
        colorRamp: combineColorRamp,
        stretchType: 'min-max'
    });

    // Esri color ramps - Blue and Red 8
// #ca0020,#f4a582,#f7f7f7,#92c5de,#0571b0
const colors = ["#ca0020", "#f4a582", "#f7f7f7", "#92c5de", "#0571b0"];

    const colorRamp11 = new AlgorithmicColorRamp({
        algorithm: 'lab-lch',
        fromColor: '#0571b0',
        toColor: '#92c5de'
    });
    const colorRamp12 = new AlgorithmicColorRamp({
        algorithm: 'lab-lch',
        fromColor: '#92c5de',
        toColor: "#f7f7f7"
    });
    const colorRamp13 = new AlgorithmicColorRamp({
        algorithm: 'lab-lch',
        fromColor: '#f7f7f7',
        toColor: "#f4a582"
    });
    const colorRamp14 = new AlgorithmicColorRamp({
        algorithm: 'lab-lch',
        fromColor: "#f4a582",
        toColor: "#ca0020"
    });

    const colors2 = new MultipartColorRamp({
        colorRamps: [colorRamp11, colorRamp12, colorRamp13, colorRamp14]
    });

    const countOfDayRenderer2 = new RasterStretchRenderer({
        colorRamp: colors2,
        stretchType: 'min-max'
    });

   

    const idLayerRenderer = {
        type: 'simple',
        outline: {
            width: 0.5,
            color: 'black'
        }
    };

    /******************************
     * Layer rules
     * ****************************/
    // create server-defined raster function
    let serviceRasterFunction = new RasterFunction({
        functionName: 'accumulatedfrost_degreedays'
    });

    // set initial variable and dimension on mosaic dataset
    const yearDefinition = new DimensionalDefinition({
        variableName: 'accumulatedfrost_degreedays',
        dimensionName: 'Year',
        values: [2023], // yearSlider start
        isSlice: true
    });

    // create mosaicRule and set multidimensionalDefinition
    let mosaicRule = new MosaicRule({
        multidimensionalDefinition: [yearDefinition]
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

    //function to close popupTemplate if open
    const closePopup = () => {
        if (view.popup.visible) {
            view.popup.close()
        }
    };

    // create and add id layer to view
    // create and add MapImageLayer
    const idLayer = new MapImageLayer({
        url: 'https://druid.hutton.ac.uk/arcgis/rest/services/Agmet/UKagmets/ImageServer',
        title: 'Indicators by year per 1km square',
        sublayers: [{
            id: 0,
            source: {
                type: 'data-layer',
                dataSource: {
                    type: 'join-table',
                    rightTableSource: {
                        type: 'data-layer',
                        dataSource: {
                            type: 'table',
                            workspaceId: 'indicatorsTable',
                            dataSourceName: 'indicators'
                        }
                    },
                    leftTableSource: {
                        type: 'map-layer',
                        mapLayerId: 0
                    },
                    rightTableKey: 'id',
                    leftTableKey: 'id_1km',
                    joinType: 'left-outer-join'
                }
            },
            popupTemplate: {
                title: 'Line chart of indicator',
                content: [{
                    type: 'fields',
                    fieldInfos: [{
                        fieldName: ['indicators.accumulatedfrost_degreedays'],
                        label: 'accumulatedfrost_degreedays',
                        format: {
                            digitSeparator: true,
                            places: 2
                        }
                    },
                    {
                        fieldName: 'indicators.year',
                        label: 'year',
                        format: {
                            digitSeparator: false,
                            places: 0
                        }
                    }
                    ]
                },
                {
                    type: 'media',
                    mediaInfos: [{
                        title: 'line chart title',
                        type: 'line-chart',
                        value: {
                            fields: ['indicators.accumulatedfrost_degreedays'],
                            normalizeField: null,
                            tooltipField: 'indicators.accumulatedfrost_degreedays'
                        }
                    }]
                }

                ]
            }
        }]
    });
    //map.add(idLayer);


    //check idLayer is loaded and then log json
    idLayer.watch('loaded', function () {
        console.log(idLayer.sublayers.items)
    });

    // // set the histogram parameters to request
    // // data for the current view extent and resolution
    // var params = new ImageHistogramParameters({
    //     geometry: view.extent
    // });

    // create and add imagery layer to view
 const indicatorLayer = new ImageryLayer({
  title: [],
  url: 'https://druid.hutton.ac.uk/arcgis/rest/services/Agmet/UKagmets/ImageServer',
  mosaicRule: mosaicRule,
  renderer: countOfDayRenderer,
  renderingRule: serviceRasterFunction,
  opacity: 0.9,
  popupTemplate: indicatorLayerPopupTemplate
});

    map.add(indicatorLayer);
    
    // // request for histograms for the specified parameters
    // indicatorLayer.computeHistograms(params).then(function(results) {
    //         // results are returned and process it as needed.
    //         console.log("histograms and stats", results);
    //     })
    //     .catch(function(err) {
    //         console.log("err", err)
    //     });

    // // request for histograms and statistics for the specified parameters
    // indicatorLayer.computeStatisticsHistograms(params).then(function(results) {
    //         // results are returned and process it as needed.
    //         console.log("histograms and stats", results);
    //     })
    //     .catch(function(err) {
    //         console.log("err", err)
    //     });

    /******************************
     * programmatically make selectors
     *******************************/
     const indicators = {
        'accumulatedfrost_degreedays': {
            desc: 'Accumulated Frost (degree days)',
            html: '', // '<p>Sum of degree days in a year when the minimum temperature is less than 0\u00B0C</p><p>Reduced amount of accumulated frost with a continued reduction in the future</p>',
            legend: 'Accumulated Frost (degree days): sum of degree days where Tmin < 0\u00B0C',
            popup: '<b>{Raster.ItemPixelValue}</b> degree days in <b>{Year}</b> when the minimum temperature is less than 0\u00B0C',
            renderer: 'countOfDayRenderer'
        },
        'airfrost_count': {
            desc: 'Air Frost (count of days)',
            html: '', // '<p>Number of days in a year when the minimum temperature is less than 0\u00B0C</p><p>Fewer air frost days in each year with a further reduction in air frost days (c. 12-15 in coastal, 30-40 in lowland and 40-50 in mountain areas).</p>',
            legend: 'Air Frost (count of days): count of days when Tmin < 0\u00B0C',
            popup: '<b>{Raster.ItemPixelValue}</b> total days in <b>{Year}</b> when the minimum temperature is less than 0\u00B0C',
            renderer: 'countOfDayRenderer'
        },
        'cold_spell_n': {
            desc: 'Cold Spell (count of days)',
             html: '', //  '<p>Consecutive days in a year when the maximum temperature is less than the average maximum temperature in a baseline year minus 3\u00B0C (where the minimum is not less than 6 days) </p><p>Reduction in the number of days when the minimum temperature is below the average minimum temperature (1961-1990 period) and less an additional -3\u00B0C for at least 6 consecutive days.</p><p>Reduction continues into the future and becomes geographically more uniform. </p>',
            legend: 'Cold Spell (count of days): Max count of consecutive days when Tmax < avgTmax (baseline year) - 3\u00B0C (min 6 days)',
            popup: '<b>{Raster.ItemPixelValue}</b> consecutive days in <b>{Year}</b> when the maximum temperature is less than the average maximum temperature in a baseline year minus 3\u00B0C',
            renderer: 'countOfDayRenderer'
        },
        'dry_count': {
            desc: 'Dry Count (count of days)',
             html: '', //  '<p>Number of days in a year when precipitation is less than 0.2 mm</p><p>Increasing number of dry days.</p><p>Continued large increase in number of dry days, particularly in the east.</p>',
            legend: 'Dry Count (count of days): count of days when P < 0.2 mm',
            popup: '<b>{Raster.ItemPixelValue}</b> total days in <b>{Year}</b> when precipitation is less than 0.2 mm ',
            renderer: 'countOfDayRenderer2'
        },
        'dry_spell_n': {
            desc: 'Dry Spell (count of days)',
             html: '', //  '<p>Number of consecutive days in a year when precipitation is less 0.2 mm</p><p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer vitae magna efficitur, tempus lacus facilisis, vestibulum urna.</p>',
            legend: 'Dry Spell (count of days): max consecutive count P < 0.2 mm',
            popup: '<b>{Raster.ItemPixelValue}</b> consecutive days in <b>{Year}</b> when precipitation is less than 0.2 mm',
            renderer: 'countOfDayRenderer'
        },
        
    };

    const colorRamps = {
        'accumulatedfrost_degreedays' : combineColorRamp,
        'airfrost_count' : combineColorRamp,
        'cold_spell_n' : colors2,
        'dry_count' : colors2,
        'dry_spell_n' : combineColorRamp
    };

    const selectorExpression = [
        [`accumulatedfrost_degreedays`, indicators.accumulatedfrost_degreedays.desc],
        [`airfrost_count`, indicators.airfrost_count.desc],
        [`cold_spell_n`, indicators.cold_spell_n.desc], //PROBLEM WITH STATS
        [`dry_count`, indicators.dry_count.desc],
        [`dry_spell_n`, indicators.dry_spell_n.desc]
        
    ];

    // selectDivs configs
    const selectDiv = document.createElement('div');
    const selectDivs = [selectDiv];

    selectDivs.forEach(element => {
        element.setAttribute('id', 'selectDiv');
        element.setAttribute('class', 'esri-widget');
        element.setAttribute('style', 'padding: 0 10px 10px 10px;background-color:white;');
        element.setAttribute('title', `Select Agrometeorological Indicator to display on the map`) // tooltip
    });

    selectDiv.innerHTML = '<p>Select Agrometeorological Indicator:<p>';

    const selectFilter = document.createElement('select');
    const selectFilters = [selectFilter];

    selectFilters.forEach(element => {
        element.setAttribute('id', 'selectFilter');
        element.setAttribute('class', 'esri-widget');
        element.setAttribute('style', 'width: 280px;')
    })

    selectDiv.appendChild(selectFilter);

    // make options and add labels for each
    selectorExpression.forEach(element => {
        let option = document.createElement('option');
        option.value = element[0];
        option.innerHTML = element[1];

        selectFilter.appendChild(option);
    });

    // make plantheatstress_count selected
    selectFilter.value = 'accumulatedfrost_degreedays';

    // add selectDivs to view
    view.ui.add(selectDiv, 'top-left');

    /******************************
     * selectorDiv configs
     * ****************************/
    //listen to change events on indicatorSelect and change multidimensional variable
    selectFilter.addEventListener('change', () => {
        let chosenIndicator = selectFilter.value;

        changeIndicator(chosenIndicator);
        changeDescriptors(chosenIndicator);
        stopAnimation();
        closePopup();
    });

    function createRenderer(chosenIndicator) {
        const colorRamp = colorRamps[chosenIndicator];
        const renderer = new RasterStretchRenderer({
          colorRamp: colorRamp, 
          stretchType: 'min-max'
        });
        return renderer;
      };

      function changeIndicator(chosenIndicator) {
        // change mosaicRule of layer as clone and reassign
        const mosaicRuleClone = indicatorLayer.mosaicRule.clone(); // makes clone of layer's mosaicRule
        const indicatorVariable = mosaicRuleClone.multidimensionalDefinition[0];
        const renderer = createRenderer(chosenIndicator);

        indicatorVariable.values = yearSlider.get('values');
        indicatorVariable.variableName = chosenIndicator;

        mosaicRuleClone.multidimensionalDefinition = [indicatorVariable];
        indicatorLayer.mosaicRule = mosaicRuleClone;

        // change renderingRule (raster function) of layer as clone and reassign
        const renderingRuleClone = indicatorLayer.renderingRule.clone();
        renderingRuleClone.functionName = chosenIndicator;
        indicatorLayer.renderer = renderer;
        indicatorLayer.renderingRule = renderingRuleClone;
    };

    function changeDescriptors(chosenIndicator) {
        // change title of layer for Legend display
        indicatorLayer.title = indicators[chosenIndicator].legend;

        // change innerHTML of hideaway div
        const hideaway = document.getElementById('hideaway');
        const HTML30yrmaps = `
        <div id='imgGrid'>
            <div><p>1961-1990 Average</p><img src='img/${chosenIndicator}_avg1961_1990.png' alt=''></div>
            <div><p>1991-2018 Average</p><img src='img/${chosenIndicator}_avg1991_2020.png' alt=''></div>
            <div><p>2019-2050 Average</p><img src='img/${chosenIndicator}_avg2021_2050.png' alt=''></div>
            <div><p>2051-2080 Average</p><img src='img/${chosenIndicator}_avg2051_2080.png' alt=''></div>
        </div>`
        const htmlContent = HTML30yrmaps + indicators[chosenIndicator].html;

        if (indicators[chosenIndicator].desc.includes('--')) {
            hideaway.innerHTML = `<h2>${indicators[chosenIndicator].hideaway}</h2>${htmlContent}`
        } else {hideaway.innerHTML = `<h2>${indicators[chosenIndicator].desc}</h2>${htmlContent}`}
    
        // change popup contents
        const popupTemplateClone = indicatorLayer.popupTemplate.clone();
        popupTemplateClone.content = indicators[chosenIndicator].popup;
        indicatorLayer.popupTemplate = popupTemplateClone;
    };

    /************************************
     * Year Slider
     *************************************/
    const yearSlider = new Slider({
        container: 'yearSlider',
        min: 1981,
        max: 2080,
        values: [2023], // current value shown on load
        precision: 0,
        snapOnClickEnabled: true,
        visibleElements: {
            labels: true,
            rangeLabels: true
        },
        tickConfigs: [{
            mode: 'position',
            values: [1990, 2000, 2010, 2020, 2030, 2040, 2050, 2060, 2070, 2080],
            // mode: 'count',
            // values: 100,
            labelsVisible: false,
        }]
    });

    // when the user changes the yearSlider's value, change the year to reflect data
    yearSlider.on(['thumb-change', 'thumb-drag'], event => {
        updateYearDef(event.value);
        stopAnimation();
        closePopup();
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

            // // check if year has loaded on map  <- this doesnt actually do anything
            // if (indicatorLayer.mosaicRule.multidimensionalDefinition[0].values[0] == year && indicatorLayer.loaded
            //     // && indicatorLayer.load().then(function() {return true})
            // ) {
                year += 1;
                if (year > yearSlider.max) {
                    year = yearSlider.min;
                }
                yearSlider.values = [year];
                updateYearDef(year);
            // }

        }, 700) // speed of playback, milliseconds
        playButton.classList.add('toggled'); // see .toggled in css
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
            title: [`Plant Heat Stress: count of days when Tmax > 25\u00B0C`] //starting title on load
        }]
    });
    view.ui.add(legend, 'top-left');

    //add tooltip to legend
    let legendTooltip = () => {
        let legendClass = document.getElementsByClassName('esri-legend')[0];
        legendClass.setAttribute('title', `Click anywhere on the map to get the data's pixel value`)
    };
    setTimeout(legendTooltip, 1000); // wait for page to load
});

//! https://ekenes.github.io/covid19viz/
//change slider to time-window and back again
// checkbox.addEventListener( "input", (event) => {
//     if(checkbox.checked){
//       updateSlider({ mode: "time-window" });
//     } else {
//       updateSlider({ mode: "instant" });
//     }
//   });

//   interface UpdateSliderParams {
//     mode?: "time-window" | "instant",
//     filter?: string
//   }