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

    //color ramps - Blue and Green
    const colors = ["#fffcd4", "#b1cdc2", "#629eb0", "#38627a", "#0d2644"];

    const colorRamp11 = new AlgorithmicColorRamp({
    algorithm: 'lab-lch',
    fromColor: "#fffcd4",
    toColor:  "#b1cdc2"
    });
    const colorRamp12 = new AlgorithmicColorRamp({
    algorithm: 'lab-lch',
    fromColor:  "#b1cdc2",
    toColor: "#629eb0"
    });
    const colorRamp13 = new AlgorithmicColorRamp({
    algorithm: 'lab-lch',
    fromColor: "#629eb0",
    toColor:   "#38627a"
    });
    const colorRamp14 = new AlgorithmicColorRamp({
    algorithm: 'lab-lch',
    fromColor:  "#38627a",
    toColor:  "#0d2644"
    });

    const colorBlue = new MultipartColorRamp({
    colorRamps: [colorRamp11, colorRamp12, colorRamp13, colorRamp14]
    });

    const countOfDayRenderer2 = new RasterStretchRenderer({
    colorRamp: colorBlue,
    stretchType: 'min-max'
    });

    // Esri color ramps - Blue and Red 
       
    const colors3 = ["#ca0020", "#f4a582", "#f7f7f7", "#92c5de", "#0571b0"];

    const colorRamp21 = new AlgorithmicColorRamp({
        algorithm: 'lab-lch',
        fromColor: "#ca0020",
        toColor:  "#f4a582"
        });
        const colorRamp22 = new AlgorithmicColorRamp({
        algorithm: 'lab-lch',
        fromColor:  "#f4a582",
        toColor: "#f7f7f7"
        });
        const colorRamp23 = new AlgorithmicColorRamp({
        algorithm: 'lab-lch',
        fromColor: "#f7f7f7",
        toColor:  "#92c5de"
        });
        const colorRamp24= new AlgorithmicColorRamp({
        algorithm: 'lab-lch',
        fromColor:  "#92c5de",
        toColor: "#0571b0"
        });
            
        const colorRed = new MultipartColorRamp({
        colorRamps: [colorRamp21, colorRamp22, colorRamp23, colorRamp24]
        });
    
        const countOfDayRenderer3 = new RasterStretchRenderer({
        colorRamp: colorRed,
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
        functionName: 'plantheatstress_count'
    });
    
    // set initial variable and dimension on mosaic dataset
    const yearDefinition = new DimensionalDefinition({
        variableName: 'plantheatstress_count',
        dimensionName: 'Year',
        values: [2021], // yearSlider start
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

// Adding Ensembles

let map1 = {
    title: [], //The legend automatically updates when a layer's renderer, opacity, or title is changed
    url: 'https://druid.hutton.ac.uk/arcgis/rest/services/Agmet/UKagmets/ImageServer',
    mosaicRule: mosaicRule,
    renderer: countOfDayRenderer,
    renderingRule: serviceRasterFunction,
    opacity: 0.9,
    //blendMode: "multiply", //https://developers.arcgis.com/javascript/latest/sample-code/intro-blendmode-layer/
    popupTemplate: indicatorLayerPopupTemplate 
  };

  let map2 = {
    title: [], //The legend automatically updates when a layer's renderer, opacity, or title is changed
    url: 'https://abgis03.hutton.ac.uk:6443/arcgis/rest/services/Agmet/Ensemble15/ImageServer',
    mosaicRule: mosaicRule,
    renderer: countOfDayRenderer,
    renderingRule: serviceRasterFunction,
    opacity: 0.9,
    //blendMode: "multiply", //https://developers.arcgis.com/javascript/latest/sample-code/intro-blendmode-layer/
    popupTemplate: indicatorLayerPopupTemplate 
  };
  
  let map3 = {
    title: [], //The legend automatically updates when a layer's renderer, opacity, or title is changed
    url: 'https://abgis03.hutton.ac.uk:6443/arcgis/rest/services/Agmet/Ensemble13/ImageServer',
    mosaicRule: mosaicRule,
    renderer: countOfDayRenderer,
    renderingRule: serviceRasterFunction,
    opacity: 0.9,
    //blendMode: "multiply", //https://developers.arcgis.com/javascript/latest/sample-code/intro-blendmode-layer/
    popupTemplate: indicatorLayerPopupTemplate  
  };
  

  let map4 = {
    title: [], //The legend automatically updates when a layer's renderer, opacity, or title is changed
    url: 'https://abgis03.hutton.ac.uk:6443/arcgis/rest/services/Ensemble122/ImageServer',
    mosaicRule: mosaicRule,
    renderer: countOfDayRenderer,
    renderingRule: serviceRasterFunction,
    opacity: 0.9,
    //blendMode: "multiply", //https://developers.arcgis.com/javascript/latest/sample-code/intro-blendmode-layer/
    popupTemplate: indicatorLayerPopupTemplate  
  };

  let map5 = {
    title: [], //The legend automatically updates when a layer's renderer, opacity, or title is changed
    url: 'https://abgis03.hutton.ac.uk:6443/arcgis/rest/services/Agmet/Ensemble11/ImageServer',
    mosaicRule: mosaicRule,
    renderer: countOfDayRenderer,
    renderingRule: serviceRasterFunction,
    opacity: 0.9,
    //blendMode: "multiply", //https://developers.arcgis.com/javascript/latest/sample-code/intro-blendmode-layer/
    popupTemplate: indicatorLayerPopupTemplate  
  };

  let map6 = {
    title: [], //The legend automatically updates when a layer's renderer, opacity, or title is changed
    url: 'https://abgis03.hutton.ac.uk:6443/arcgis/rest/services/Agmet/Ensemble10/ImageServer',
    mosaicRule: mosaicRule,
    renderer: countOfDayRenderer,
    renderingRule: serviceRasterFunction,
    opacity: 0.9,
    //blendMode: "multiply", //https://developers.arcgis.com/javascript/latest/sample-code/intro-blendmode-layer/
    popupTemplate: indicatorLayerPopupTemplate  
  };

  let map7 = {
    title: [], //The legend automatically updates when a layer's renderer, opacity, or title is changed
    url: 'https://abgis03.hutton.ac.uk:6443/arcgis/rest/services/Agmet/Ensemble9/ImageServer',
    mosaicRule: mosaicRule,
    renderer: countOfDayRenderer,
    renderingRule: serviceRasterFunction,
    opacity: 0.9,
    //blendMode: "multiply", //https://developers.arcgis.com/javascript/latest/sample-code/intro-blendmode-layer/
    popupTemplate: indicatorLayerPopupTemplate  
  };

  let map8 = {
    title: [], //The legend automatically updates when a layer's renderer, opacity, or title is changed
    url: 'https://abgis03.hutton.ac.uk:6443/arcgis/rest/services/Agmet/Ensemble8/ImageServer',
    mosaicRule: mosaicRule,
    renderer: countOfDayRenderer,
    renderingRule: serviceRasterFunction,
    opacity: 0.9,
    //blendMode: "multiply", //https://developers.arcgis.com/javascript/latest/sample-code/intro-blendmode-layer/
    popupTemplate: indicatorLayerPopupTemplate  
  };

  let map9 = {
    title: [], //The legend automatically updates when a layer's renderer, opacity, or title is changed
    url: 'https://abgis03.hutton.ac.uk:6443/arcgis/rest/services/Agmet/Ensemble7/ImageServer',
    mosaicRule: mosaicRule,
    renderer: countOfDayRenderer,
    renderingRule: serviceRasterFunction,
    opacity: 0.9,
    //blendMode: "multiply", //https://developers.arcgis.com/javascript/latest/sample-code/intro-blendmode-layer/
    popupTemplate: indicatorLayerPopupTemplate  
  };

  let map10 = {
    title: [], //The legend automatically updates when a layer's renderer, opacity, or title is changed
    url: 'https://abgis03.hutton.ac.uk:6443/arcgis/rest/services/Ensemble666/ImageServer',
    mosaicRule: mosaicRule,
    renderer: countOfDayRenderer,
    renderingRule: serviceRasterFunction,
    opacity: 0.9,
    //blendMode: "multiply", //https://developers.arcgis.com/javascript/latest/sample-code/intro-blendmode-layer/
    popupTemplate: indicatorLayerPopupTemplate  
  };

  let map11 = {
    title: [], //The legend automatically updates when a layer's renderer, opacity, or title is changed
    url: 'https://abgis03.hutton.ac.uk:6443/arcgis/rest/services/Agmet/Ensemble5/ImageServer',
    mosaicRule: mosaicRule,
    renderer: countOfDayRenderer,
    renderingRule: serviceRasterFunction,
    opacity: 0.9,
    //blendMode: "multiply", //https://developers.arcgis.com/javascript/latest/sample-code/intro-blendmode-layer/
    popupTemplate: indicatorLayerPopupTemplate  
  };

  let map12 = {
    title: [], //The legend automatically updates when a layer's renderer, opacity, or title is changed
    url: 'https://abgis03.hutton.ac.uk:6443/arcgis/rest/services/Agmet/Ensemble4/ImageServer',
    mosaicRule: mosaicRule,
    renderer: countOfDayRenderer,
    renderingRule: serviceRasterFunction,
    opacity: 0.9,
    //blendMode: "multiply", //https://developers.arcgis.com/javascript/latest/sample-code/intro-blendmode-layer/
    popupTemplate: indicatorLayerPopupTemplate  
  };

  let map13 = {
    title: [], //The legend automatically updates when a layer's renderer, opacity, or title is changed
    url: 'https://abgis03.hutton.ac.uk:6443/arcgis/rest/services/Ensemble111/ImageServer',
    mosaicRule: mosaicRule,
    renderer: countOfDayRenderer,
    renderingRule: serviceRasterFunction,
    opacity: 0.9,
    //blendMode: "multiply", //https://developers.arcgis.com/javascript/latest/sample-code/intro-blendmode-layer/
    popupTemplate: indicatorLayerPopupTemplate  
  };

  // Initialize the indicator layer with the default selected map
let selectedMap = map1;
const indicatorLayer = new ImageryLayer(selectedMap);
map.add(indicatorLayer);

// Add Selector Title
const title = document.createElement('p');
title.textContent = 'Select Ensemble:';
title.style.margin = '0 10px 10px 10px';

// Add Selector Container
const selectorContainer = document.createElement('div');
selectorContainer.setAttribute('id', 'selectDiv');
selectorContainer.setAttribute('class', 'esri-widget');
selectorContainer.setAttribute('style', 'padding: 0 10px 10px 10px;background-color:white;');
selectorContainer.setAttribute('title', 'Select Agrometeorological Indicator to display on the map');
selectorContainer.appendChild(title);

// Add Selector
const selector = document.createElement('select');
const layerOptions = [
  { value: 'map1', text: 'Mean of Ensembles' },
  { value: 'map2', text: 'Ensemble 15' },
  { value: 'map3', text: 'Ensemble 13' },
  { value: 'map4', text: 'Ensemble 12' },
  { value: 'map5', text: 'Ensemble 11' },
  { value: 'map6', text: 'Ensemble 10' },
  { value: 'map7', text: 'Ensemble 9' },
  { value: 'map8', text: 'Ensemble 8' },
  { value: 'map9', text: 'Ensemble 7' },
  { value: 'map10', text: 'Ensemble 6' },
  { value: 'map11', text: 'Ensemble 5' },
  { value: 'map12', text: 'Ensemble 4' },
  { value: 'map13', text: 'Ensemble 1' },
];
layerOptions.forEach(option => {
  const optionElement = document.createElement('option');
  optionElement.value = option.value;
  optionElement.text = option.text;
  selector.add(optionElement);
});

// Add the same class and style attributes as selectDiv
selector.setAttribute('class', 'esri-widget');
selector.setAttribute('style', 'background-color:white;');
selector.setAttribute('style', 'width: 280px;')

selectorContainer.appendChild(selector);
view.ui.add(selectorContainer, 'top-left');

  

     // Listen to the value change event of the selector
    selector.addEventListener('change', function() {
         // Update year definition with the selected year and indicator
        const selectedIndicator = selectFilter.value;
        const selectedYear = parseInt(yearSlider.value);
         yearDefinition.values = [selectedYear];
    
         // Update the selected map based on the selector's value
        if (this.value === 'map1') {
        selectedMap = map1;
        } else if (this.value === 'map2') {
        selectedMap = map2;
        } else if(this.value === 'map3') {
            selectedMap = map3
        } else if (this.value === 'map4') {
            selectedMap = map4
        } else if (this.value === 'map5') {
            selectedMap = map5
        } else if (this.value === 'map6') {
            selectedMap = map6
        } else if (this.value === 'map7') {
            selectedMap = map7
        } else if (this.value === 'map8') {
            selectedMap = map8
        } else if (this.value === 'map9') {
            selectedMap = map9
        } else if (this.value === 'map10') {
            selectedMap = map10
        } else if (this.value === 'map11') {
            selectedMap = map11
        } else if (this.value === 'map12') {
            selectedMap = map12
        } else if (this.value === 'map13') {
            selectedMap = map13
        }

         // Update the indicator layer with the selected map
        console.log('Selected map:', selectedMap);
        indicatorLayer.url = selectedMap.url;
        indicatorLayer.renderer = selectedMap.renderer;
        indicatorLayer.renderingRule = selectedMap.renderingRule;
        indicatorLayer.opacity = selectedMap.opacity;
        indicatorLayer.popupTemplate = selectedMap.popupTemplate;
        console.log('Indicator layer:', indicatorLayer);

         // Update the indicator dropdown to the selected indicator
        selectFilter.value = yearDefinition.variableName;


         // Create a new mosaic rule with the updated year definition
        mosaicRule = new MosaicRule({
          multidimensionalDefinition: [yearDefinition]
        });

         // Update the indicator layer mosaic rule with the new mosaic rule
        indicatorLayer.mosaicRule = mosaicRule;

        changeIndicator(selectedIndicator);
        changeDescriptors(selectedIndicator);
        stopAnimation();
        closePopup();

    });
  
  
  
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
            html: '<br> The Accumulated Frost Days Indicator is the sum of degree days when the minimum temperature per day is below zero. It thus accumulates the amount of cold temperature per day when the minimum temperature is below zero. It shows where cold temperatures are more likely to be experienced for longer. <br><br><b>Calculation:</b> <i> ∑ of day degrees where Tmin < 0.0 °C', 
            legend: 'Accumulated Frost (degree days): sum of degree days where Tmin < 0\u00B0C',
            popup: '<b>{Raster.ItemPixelValue}</b> degree days in <b>{Year}</b> when the minimum temperature is less than 0\u00B0C'
        },
        'airfrost_count': {
            desc: 'Air Frost (count of days)',
            html: '<br> The Air Frost Indictor is the count of the number of days when the minimum temperature is below zero. This is when we might expect to experience a frost in the air, so is the number of days when air frost is likely to occur. <br><br><b>Calculation:</b> <i> Days when Tmin < 0.0 °C ', 
            popup: '<b>{Raster.ItemPixelValue}</b> total days in <b>{Year}</b> when the minimum temperature is less than 0\u00B0C'
        },
        'cold_spell_n': {
            desc: 'Cold Spell (count of days)',
             html: '<br> The Cold Spell Indicator is the maximum count of days when the minimum temperature is below the average minimum temperature (for the baseline 1960-1990 period) and less an additional -3°C for at least 6 consecutive days. Locations that normally already have low temperatures (e.g. Scottish Highlands) may not necessarily show up more than other locations. This indicator tells us where unusually cold spells may occur. <br><br><b>Calculation:</b> <i> Maximum count of consecutive days when Tmin < Avg Tmin (baseline year) - 3.0 °C (minimum 6 days) ',
            legend: 'Cold Spell (count of days): Max count of consecutive days when Tmax < avgTmax (baseline year) - 3\u00B0C (min 6 days)',
            popup: '<b>{Raster.ItemPixelValue}</b> consecutive days in <b>{Year}</b> when the maximum temperature is less than the average maximum temperature in a baseline year minus 3\u00B0C'
        },
        'dry_count': {
            desc: 'Dry Day Count (count of days)',
             html: '<br> The Dry Days Indicator is the total number of days per year when precipitation is less than 0.2mm per day. I shows the number of days per year with no rain. <br><br><b>Calculation:</b> <i> Days when P < 0.2 mm ',
            legend: 'Dry Count (count of days): count of days when P < 0.2 mm',
            popup: '<b>{Raster.ItemPixelValue}</b> total days in <b>{Year}</b> when precipitation is less than 0.2 mm '
        },
        'dry_spell_n': {
            desc: 'Dry Spell (count of days)',
             html: '<br> The Dry Spell Indicator is the count of the maximum number of consecutive days within a year when rainfall is less than 0.2mm per day. It represents the longest period when there is no rain in a year. <br><br><b>Calculation:</b> <i> Max consecutive count P < 0.2 mm ',
            legend: 'Dry Spell (count of days): max consecutive count P < 0.2 mm',
            popup: '<b>{Raster.ItemPixelValue}</b> consecutive days in <b>{Year}</b> when precipitation is less than 0.2 mm'
        },
        'end_growingseason': {
            desc: 'End of Growing Season (day of year)',
             html: '<br> The End of Growing Season Indicator is the date when there has been five consecutive days when the average temperature is less than 5.6°C (starting from 1st July). It tells us approximately when grass may be expected to stop growing. Whilst warmer temperatures may follow these consecutive days and grass is still able to grow, it is a useful indication of when crop growth ends and also when trafficability (on soil) issues may arise and livestock may start to be housed. <br><br><b>Calculation:</b> <i> Day when 5 consecutive days Tavg < 5.6 °C (from July 1st) ', 
            legend: 'End of Growing Season (day of year): day when 5 consecutive days Tavg < 5.6\u00B0C from 1 July',
            popup: '<b>{Raster.ItemPixelValue}</b>th day of the year (out of 365) in <b>{Year}</b> when average temperature for five consecutive days is less than 5.6\u00B0C from 1 July'
        },
        'first_airfrost_doy': {
            desc: 'First Airfrost (day of year)',
             html: '<br> The First Air Frost Indicator is the first day after the 1st July when the minimum temperature falls below freezing (0.0°C). It tells us the first day in autumn when there is likely to be an air frost. It can be seen as an indicator of when field operations may cease and crops are vulnerable to damage. A later day in the year also indicates an extension to the growing season and is associated with higher minimum temperatures. A delay in the first autumn air frost may also impact on the timing and rate of biological processes. <br><br><b>Calculation:</b> <i> Day when Tmin < 0.0 °C (from July 1st)',
            legend: 'First Airfrost (day of year): first day when Tmin < 0\u00B0C from 1 July',
            popup: '<b>{Raster.ItemPixelValue}</b>th day of the year (out of 365) in <b>{Year}</b> when the minimum temperature is less than 0\u00B0C from 1 July'
        },
        'first_grassfrost_doy': {
            desc: 'First Grassfrost (day of year)',
             html: '<br> The First Grass Frost Indictor is the first day after the 1st July when the temperature is less than 5°C. An air temperature below 5°C means there is a risk of grass frost occurring. <br><br><b>Calculation:</b> <i> Day when Tmin < 5.0 oC (from July 1st)',
            legend: 'First Grassfrost (day of year): first day when Tmin < 5\u00B0C from 1 July',
            popup: '<b>{Raster.ItemPixelValue}</b>th day of the year (out of 365) in <b>{Year}</b> when the minimum temperature is less than 5\u00B0C from 1 July'
        },
        'grassfrost_count': {
            desc: 'Grassfrost Count (count of days)',
             html: '<br> The Grass Frost Indicator is the number of days in a year when minimum temperature is less than 5.0°C and represents the total number of days when grass frost may occur. <br><br><b>Calculation:</b> <i> Count of days per year when Tmin < 5.0°C  ',
            legend: 'Grassfrost (count of days): count of days when Tmin < 5\u00B0C',
            popup: '<b>{Raster.ItemPixelValue}</b> total days in <b>{Year}</b> when the minimum temperature is less than 5\u00B0C'
        },
        'growing_degreedays': {
            desc: 'Growing Degree Days',
             html: '<br> The Growing Degree Days Indicator represents thermal time accumulation in degree days and is the count of above days when the average temperature is above 5.6°C. It tells us how quickly thermal time is accumulated, and thus how more rapidly plants and insects may progress through their development stages (phenology). <br><br><b>Calculation:</b> <i> ∑ Tavg > 5.6 °C ',
            legend: 'Growing (degree days): sum Tavg > 5.6\u00B0C',
            popup: '<b>{Raster.ItemPixelValue}</b> degree days in <b>{Year}</b> when the average temperature is greater than 5.6\u00B0C'
        },
        'growing_season': {
            desc: 'Growing Season (count of days)',
             html: '<br> The Growing Season Indicator is the count of the number of days in a year when temperature is above 5°C, start from the first period in the year when there are 5 consecutive days above 5°C and ending when there are 5 consecutive days below 5°C. It gives a general representation of how many days in a year plant growth and other biological activity may occur. It is one of three ways of representing the growing season period: see also growing Season Length and Growing Season Range. <br><br><b>Calculation:</b> <i> beginning when the temperature on five consecutive days exceeds 5°C, and ending when the temperature on five consecutive days is below 5°C ', 
            legend: 'Growing Season (count of days): beginning when the temperature on five consecutive days exceeds 5\u00B0C, and ending when the temperature on five consecutive days is below 5\u00B0C',
            popup: '<b>{Raster.ItemPixelValue}</b> total days in <b>{Year}</b> when the temperature on five consecutive days exceeds 5\u00B0C, and ending when the temperature on five consecutive days is below 5\u00B0C'
        },
        'growseason_length': {
            desc: 'Grow Season Length (count of days)',
             html: '<br> The Growing Season Length Indicator is the count of the number of days when daily average temperature is above 5.6°C between the Start and End of the Growing Season (these are two other types of Indicators). Days when average temperatures are above 5.6°C are ones where grass is likely to grow. It is different from the Growing Season Range in that it covers individual days when average temperature is above 5.6°C and thus all the days when grass may grow. However, it does not take account if days when grass may not grow due to stresses such as water or nitrogen limitations. <br><br><b>Calculation:</b> <i> Days when Tavg > 5.6 °C between Start and End of Growing Season. ', 
            legend: 'Grow Season Length (count of days): days when Tavg > 5.6\u00B0C between start and end of growing season',
            popup: '<b>{Raster.ItemPixelValue}</b> total days in <b>{Year}</b> when the average temperature is greater than 5.6\u00B0C between the start and the end of growing season'
        },
       'growseason_range': {
            desc: 'Grow Season Range (count of days)',
             html: '<br> The Growing Season Range Indicator is the count of days between the Start and End of Growing Season, thus is derived from these other two Indicators. It tells us how the growing season range has and may change. <br><br><b>Calculation:</b> <i> count of days between the start and end of the growing season. Start of Growing Season: Day when 5 consecutive days Tavg > 5.6 °C (from Jan 1st). End of Growing Season: Day when 5 consecutive days Tavg < 5.6 °C (from July 1st). ',
            legend: 'Grow Season Range (count of days): days between start and end of growing season',
            popup: '<b>{Raster.ItemPixelValue}</b> total days in <b>{Year}</b> calculated from the count of days between the start and end of the growing season'
        },
        'heating_degreedays': {
            desc: 'Heating Degree Days',
             html: '<br> The Heating Degree Days Indicator is the sum of temperatures below a threshold, in this case the sum of 15.5°C minus the average temperature when this is less than 15.5°C. In other words, it accumulates thermal time below the 15.5°C threshold. It is used to provide information about the requirement to heat buildings. This information tells us when the need to use energy for heating buildings increases or decreases (fewer degree days = less heating requirement). <br><br><b>Calculation:</b> <i> ∑ 15.5 °C - Tavg where Tavg < 15.5 °C ', 
            legend: 'Heating (degree days): Sum of 15.5\u00B0C minus Tavg where Tavg < 15.5\u00B0C',
            popup: '<b>{Raster.ItemPixelValue}</b> degree days in <b>{Year}</b> representing the sum of 15.5\u00B0C minus the average temperature where the average temperature is less than 15.5\u00B0C'
        },
        'heatwave_n': {
            desc: 'Heatwave (count of days)',
             html: '<br> The Heat Wave Indicator is the maximum count in a year of the number of days when the daily maximum temperature is above the long-term average maximum temperature (estimated from the 1960-1990 period) and an additional 3°C for at least 6 consecutive days. It represents the longest period in a year when the maximum temperature is at least 3°C above the historical long-term average for at least 6 consecutive days.  <br><br><b>Calculation:</b> <i> Maximum count of consecutive days when Tmax >Avg Tmax (baseline year) + 3.0 oC (minimum 6 days) ', 
            legend: 'Heatwave (count of days): Max count of consecutive days when Tmax > avgTmax (baseline year) + 3\u00B0C (min 6 days)',
            popup: '<b>{Raster.ItemPixelValue}</b> total days in <b>{Year}</b> when the maximum temperature is greater than the average temperature in a baseline year plus 3\u00B0C'
        },
        'last_airfrost_doy': {
            desc: 'Last Airfrost (day of year)',
             html: '<br> The Last Air Frost is the last day from 1st January, but before the 1st July, when the minimum temperature is below zero. It tells us the day of year on which the last air frost may occur in spring. Earlier dates imply the opportunity for the growing season to start sooner and avoid risk of frost damage. <br><br><b>Calculation:</b> <i> The last day when Tmin < 0.0 oC (from Jan 1st) and before 1st July.  ',
            legend: 'Last Airfrost (day of year): last day when Tmin < 0\u00B0C before 1 July',
            popup: '<b>{Raster.ItemPixelValue}</b>th day of the year (out of 365) in <b>{Year}</b> when the minimum temperature is less than 0\u00B0C before 1 July'
        },
        'last_grassfrost_doy': {
            desc: 'Last Grassfrost (day of year)',
             html: '<br> The Last Grass Frost is the last day from 1st January, but before the 1st July, when the minimum air temperature is below 5.0°C. It tells us the day of year on which the last grass frost may occur in spring. Earlier dates imply the opportunity for the growing season to start sooner and avoid risk of frost damage. <br><br><b>Calculation:</b> <i> The last day when Tmin < 5.0 °C (from Jan 1st) and before the 1st July. ',
            legend: 'Last Grassfrost (day of year): last day when Tmin < 5\u00B0C before 1 July',
            popup: '<b>{Raster.ItemPixelValue}</b>th day of the year (out of 365) in <b>{Year}</b> when the minimum temperature is less than 5\u00B0C before 1 July'
        }, 
        'max_anntemp': {
            desc: 'Maximum Annual Temperature (\u00B0C)',
            html: '<br>This is the highest maximum air temperature per year. <br><br><b>Calculation:</b> <i>The highest maximum temperature (\u00B0C)',
            legend: 'Maximum Annual Temperature (\u00B0C): highest temperature per year',
            popup: '<b>{Raster.ItemPixelValue}</b>\u00B0C is the highest temperature in <b>{Year}</b>'
        },
        'max_jantemp': {
            desc: '&nbsp;&nbsp;-- max temp in January',
            hideaway: 'Maximum Temperature in January (\u00B0C)',
            html: '<br> This is the highest maximum January air temperature',
            legend: 'Maximum Temperature in January (\u00B0C): highest temperature in January per year',
            popup: '<b>{Raster.ItemPixelValue}</b>\u00B0C is the highest temperature in January in <b>{Year}</b>'
        },
        'max_febtemp': {
            desc: '&nbsp;&nbsp;-- max temp in February',
            hideaway: 'Maximum Temperature in February (\u00B0C)',
            html: '<br> This is the highest maximum February air temperature',
            legend: 'Maximum Temperature in February (\u00B0C): highest temperature in February per year',
            popup: '<b>{Raster.ItemPixelValue}</b>\u00B0C is the highest temperature in February in <b>{Year}</b>'
        },
        'max_martemp': {
            desc: '&nbsp;&nbsp;-- max temp in March',
            hideaway: 'Maximum Temperature in March (\u00B0C)',
            html: '<br> This is the highest maximum March air temperature',
            legend: 'Maximum Temperature in March (\u00B0C): highest temperature in March per year',
            popup: '<b>{Raster.ItemPixelValue}</b>\u00B0C is the highest temperature in March in <b>{Year}</b>'
        },
        'max_aprtemp': {
            desc: '&nbsp;&nbsp;-- max temp in April',
            hideaway: 'Maximum Temperature in April (\u00B0C)',
            html: '<br> This is the highest maximum April air temperature',
            legend: 'Maximum Temperature in April (\u00B0C): highest temperature in April per year',
            popup: '<b>{Raster.ItemPixelValue}</b>\u00B0C is the highest temperature in April in <b>{Year}</b>'
        },
        'max_maytemp': {
            desc: '&nbsp;&nbsp;-- max temp in May',
            hideaway: 'Maximum Temperature in May (\u00B0C)',
            html: '<br> This is the highest maximum May air temperature',
            legend: 'Maximum Temperature in May (\u00B0C): highest temperature in May per year',
            popup: '<b>{Raster.ItemPixelValue}</b>\u00B0C is the highest temperature in May in <b>{Year}</b>'
        },
        'max_juntemp': {
            desc: '&nbsp;&nbsp;-- max temp in June',
            hideaway: 'Maximum Temperature in June (\u00B0C)',
            html: '<br> This is the highest maximum June air temperature',
            legend: 'Maximum Temperature in June (\u00B0C): highest temperature in June per year',
            popup: '<b>{Raster.ItemPixelValue}</b>\u00B0C is the highest temperature in June in <b>{Year}</b>'
        },
        'max_jultemp': {
            desc: '&nbsp;&nbsp;-- max temp in July',
            hideaway: 'Maximum Temperature in July (\u00B0C)',
            html: '<br> This is the highest maximum July air temperature',
            legend: 'Maximum Temperature in July (\u00B0C): highest temperature in July per year',
            popup: '<b>{Raster.ItemPixelValue}</b>\u00B0C is the highest temperature in July in <b>{Year}</b>'
        },
        'max_augtemp': {
            desc: '&nbsp;&nbsp;-- max temp in August',
            hideaway: 'Maximum Temperature in August (\u00B0C)',
            html: '<br> This is the highest maximum August air temperature',
            legend: 'Maximum Temperature in August (\u00B0C): highest temperature in August per year',
            popup: '<b>{Raster.ItemPixelValue}</b>\u00B0C is the highest temperature in August in <b>{Year}</b>'
        },
        'max_septemp': {
            desc: '&nbsp;&nbsp;-- max temp in September',
            hideaway: 'Maximum Temperature in September (\u00B0C)',
            html: '<br> This is the highest maximum September air temperature',
            legend: 'Maximum Temperature in September (\u00B0C): highest temperature in September per year',
            popup: '<b>{Raster.ItemPixelValue}</b>\u00B0C is the highest temperature in September in <b>{Year}</b>'
        },
        'max_octtemp': {
            desc: '&nbsp;&nbsp;-- max temp in October',
            hideaway: 'Maximum Temperature in October (\u00B0C)',
            html: '<br> This is the highest maximum October air temperature',
            legend: 'Maximum Temperature in October (\u00B0C): highest temperature in October per year',
            popup: '<b>{Raster.ItemPixelValue}</b>\u00B0C is the highest temperature in October in <b>{Year}</b>'
        },
        'max_novtemp': {
            desc: '&nbsp;&nbsp;-- max temp in November',
            hideaway: 'Maximum Temperature in November (\u00B0C)',
            html: '<br> This is the highest maximum November air temperature',
            legend: 'Maximum Temperature in November (\u00B0C): highest temperature in November per year',
            popup: '<b>{Raster.ItemPixelValue}</b>\u00B0C is the highest temperature in November in <b>{Year}</b>'
        },
        'max_dectemp': {
            desc: '&nbsp;&nbsp;-- max temp in December',
            hideaway: 'Maximum Temperature in December (\u00B0C)',
            html: '<br> This is the highest maximum December air temperature',
            legend: 'Maximum Temperature in December (\u00B0C): highest temperature in December per year',
            popup: '<b>{Raster.ItemPixelValue}</b>\u00B0C is the highest temperature in December in <b>{Year}</b>'
        },
        'min_anntemp': {
            desc: 'Minimum Annual Temperature(\u00B0C)',
            html: '<br>This is the lowest minimum air temperature per year. <br><br><b>Calculation:</b> <i>The lowest minimum temperature (\u00B0C)',
            legend: 'Minimum Annual Temperature (\u00B0C): lowest temperature per year',
            popup: '<b>{Raster.ItemPixelValue}</b>\u00B0C is the lowest temperature in <b>{Year}</b>'
        },
        'min_jantemp': {
            desc: '&nbsp;&nbsp;-- min temp in January',
            hideaway: 'Minimum Temperature in January (\u00B0C)',
            html: '<br> This is the lowest minimum January air temperature',
            legend: 'Minimum Temperature in January (\u00B0C): lowest temperature in January per year',
            popup: '<b>{Raster.ItemPixelValue}</b>\u00B0C is the lowest temperature in January in <b>{Year}</b>'
        },
        'min_febtemp': {
            desc: '&nbsp;&nbsp;-- min temp in February',
            hideaway: 'Minimum Temperature in February (\u00B0C)',
            html: '<br>This is the lowest minimum Februray air temperature',
            legend: 'Minimum Temperature in February (\u00B0C): lowest temperature in February per year',
            popup: '<b>{Raster.ItemPixelValue}</b>\u00B0C is the lowest temperature in February in <b>{Year}</b>'
        },
        'min_martemp': {
            desc: '&nbsp;&nbsp;-- min temp in March',
            hideaway: 'Minimum Temperature in March (\u00B0C)',
            html: '<br>This is the lowest minimum March air temperature',
            legend: 'Minimum Temperature in March (\u00B0C): lowest temperature in March per year',
            popup: '<b>{Raster.ItemPixelValue}</b>\u00B0C is the lowest temperature in March in <b>{Year}</b>'
        },
        'min_aprtemp': {
            desc: '&nbsp;&nbsp;-- min temp in April',
            hideaway: 'Minimum Temperature in April (\u00B0C)',
            html: '<br>This is the lowest minimum April air temperature',
            legend: 'Minimum Temperature in April (\u00B0C): lowest temperature in April per year',
            popup: '<b>{Raster.ItemPixelValue}</b>\u00B0C is the lowest temperature in April in <b>{Year}</b>'
        },
        'min_maytemp': {
            desc: '&nbsp;&nbsp;-- min temp in May',
            hideaway: 'Minimum Temperature in May (\u00B0C)',
            html: '<br>This is the lowest minimum May air temperature',
            legend: 'Minimum Temperature in May (\u00B0C): lowest temperature in May per year',
            popup: '<b>{Raster.ItemPixelValue}</b>\u00B0C is the lowest temperature in May in <b>{Year}</b>'
        },
        'min_juntemp': {
            desc: '&nbsp;&nbsp;-- min temp in June',
            hideaway: 'Minimum Temperature in June (\u00B0C)',
            html: '<br>This is the lowest minimum June air temperature',
            legend: 'Minimum Temperature in June (\u00B0C): lowest temperature in June per year',
            popup: '<b>{Raster.ItemPixelValue}</b>\u00B0C is the lowest temperature in June in <b>{Year}</b>'
        },
        'min_jultemp': {
            desc: '&nbsp;&nbsp;-- min temp in July',
            hideaway: 'Minimum Temperature in July (\u00B0C)',
            html: '<br>This is the lowest minimum July air temperature',
            legend: 'Minimum Temperature in July (\u00B0C): lowest temperature in July per year',
            popup: '<b>{Raster.ItemPixelValue}</b>\u00B0C is the lowest temperature in July in <b>{Year}</b>'
        },
        'min_augtemp': {
            desc: '&nbsp;&nbsp;-- min temp in August',
            hideaway: 'Minimum Temperature in August (\u00B0C)',
            html: '<br>This is the lowest minimum August air temperature',
            legend: 'Minimum Temperature in August (\u00B0C): lowest temperature in August per year',
            popup: '<b>{Raster.ItemPixelValue}</b>\u00B0C is the lowest temperature in August in <b>{Year}</b>'
        },
        'min_septemp': {
            desc: '&nbsp;&nbsp;-- min temp in September',
            hideaway: 'Minimum Temperature in September (\u00B0C)',
            html: '<br>This is the lowest minimum September air temperature',
            legend: 'Minimum Temperature in September (\u00B0C): lowest temperature in September per year',
            popup: '<b>{Raster.ItemPixelValue}</b>\u00B0C is the lowest temperature in September in <b>{Year}</b>'
        },
        'min_octtemp': {
            desc: '&nbsp;&nbsp;-- min temp in October',
            hideaway: 'Minimum Temperature in October (\u00B0C)',
            html: '<br>This is the lowest minimum October air temperature',
            legend: 'Minimum Temperature in October (\u00B0C): lowest temperature in October per year',
            popup: '<b>{Raster.ItemPixelValue}</b>\u00B0C is the lowest temperature in October in <b>{Year}</b>'
        },
        'min_novtemp': {
            desc: '&nbsp;&nbsp;-- min temp in November',
            hideaway: 'Minimum Temperature in November (\u00B0C)',
            html: '<br>This is the lowest minimum November air temperature',
            legend: 'Minimum Temperature in November (\u00B0C): lowest temperature in November per year',
            popup: '<b>{Raster.ItemPixelValue}</b>\u00B0C is the lowest temperature in November in <b>{Year}</b>'
        },
        'min_dectemp': {
            desc: '&nbsp;&nbsp;-- min temp in December',
            hideaway: 'Minimum Temperature in December (\u00B0C)',
            html: '<br>This is the lowest minimum December air temperature',
            legend: 'Minimum Temperature in December (\u00B0C): lowest temperature in December per year',
            popup: '<b>{Raster.ItemPixelValue}</b>\u00B0C is the lowest temperature in December in <b>{Year}</b>'
        },
        'p_heterogeneity': {
            desc: 'Precipitation Heterogeneity (index) ',
             html: '<br> The Precipitation Heterogeneity Index is a unitless Indicator and provides information about the erosivity of rainfall. It represents the ratio between average monthly rainfall and average annual rainfall, and is a useful indicator of rainfall strength and force and potential erosion risk. See also the Precipitation Intensity Index as an alternative representation of precipitation intensity and erosivity. <br><br><b>Calculation:</b> <i> Modified Fournier Index MFI= ∑i=112Pi2Pt with Pi being the monthly precipitation and Pt the annual precipitation ',
            legend: 'P Heterogeneity (index): P > 0.2 / count days P > 0.2mm',
            popup: '<b>{Raster.ItemPixelValue}</b>: index of precipitation intensity in <b>{Year}</b>'
        },
        'p_intensity': {
            desc: 'Precipitation Intensity (index)',
             html: '<br> The Precipitation Intensity Indicator is an index calculated by estimating the sum of rainfall when it is above 0.2mm per day and dividing this by the count of the number of days when rainfall is greater than 0.2mm. It does not have any units and provides information about the intensity and erosivity of rainfall, which is more intense where there are high values (due to monthly precipitation concentration and total annual amounts). Unsurprisingly this Indicator often tends to match spatially with rainfall total amounts and elevation. The maps show this, with upland areas often having higher indicator values. <br><br><b>Calculation:</b> <i> ∑P > 0.2mm /Count days P > 0.2mm ',
            legend: 'P Intensity (index): P > 0.2 / count days P > 0.2mm',
            popup: '<b>{Raster.ItemPixelValue}</b>: index of precipitation intensity in <b>{Year}</b>'
        },
       'p_seasonality': {
            desc: 'Precipitation Seasonality (index)',
             html: '<br> The Precipitation Seasonality Indicator tells us whether more rain falls in the winter or summer periods. This is for rainfall only, hence snow in the winter is not included. The maps show that overall more rain falls in the summer than the winter (in quantity, not the number of rain days). <br><br><b>Calculation:</b> <i> S = winter P - summer P / annual total P ',
            legend: 'P Seasonality (index): S = winter P - summer P / annual total P',
            popup: '<b>{Raster.ItemPixelValue}</b>: index of precipitation seasonality in <b>{Year}</b>'
        },
        'personheatstress_count': {
            desc: 'Person Heat Stress (count of days)',
             html: '<br> The Person Heat Stress Indicator is the count of the number of days per year when the maximum temperature is over 32°C, which is considered an amount of heat at which people may experience heat stress. <br><br><b>Calculation:</b> <i> count of days when Tmax > 32°C', 
            legend: 'Person Heat Stress (count of days): count of days when Tmax > 32\u00B0C',
            popup: '<b>{Raster.ItemPixelValue}</b> total days in <b>{Year}</b> when the maximum temperature is greater than 32\u00B0C'
        },
        'plantheatstress_count': {
            desc: 'Plant Heat Stress (count of days)',
             html: '<br> The Plant Heat Stress Indicator is the count of the number of days in a year when the maximum temperature is above 25°C. This value is considered as indicator of when crops in general may experience heat stress that may affect growth and implies additional water requirements. The actual level of heat stress will vary between crops and availability of water and canopy cooling by transpiration. <br><br><b>Calculation:</b> <i> count of days when Tmax > 25°C ', 
            legend: 'Plant Heat Stress (count of days): count of days when Tmax > 25\u00B0C',
            popup: '<b>{Raster.ItemPixelValue}</b> total days in <b>{Year}</b> when the maximum temperature is greater than 25\u00B0C'
        },
        'rfall_annualtotal': {
            desc: 'Rainfall Annual Total (mm)',
             html: '<br> This is the total amount of precipitation in a year. <br><br><b>Calculation:</b> <i> It is calculated by summing the daily amount of rainfall per year. ', 
            legend: 'Rainfall Annual Total (mm): sum of rainfall per year',
            popup: '<b>{Raster.ItemPixelValue}</b> mm of rainfall in <b>{Year}</b>'
        },
        'rfall_springtotal': {
            desc: 'Rainfall Total in Spring (mm)',
             html: '<br> This is the total amount of precipitation in Spring. <br><br><b>Calculation:</b> <i> It is calculated by summing the daily amount of rainfall in March, April and May per year', 
            legend: 'Rainfall Total in Spring (mm): sum of rainfall in March, April and May per year',
            popup: '<b>{Raster.ItemPixelValue}</b> mm of rainfall in Spring in <b>{Year}</b>'
        },
        'rfall_summertotal': {
            desc: 'Rainfall Total in Summer (mm)',
             html: '<br> This is the total amount of precipitation in Summer. <br><br><b>Calculation:</b> <i> It is calculated by summing the daily amount of rainfall in June, July and August per year ', 
            legend: 'Rainfall Total in Summer (mm): sum of rainfall in June, July and August per year',
            popup: '<b>{Raster.ItemPixelValue}</b> mm of rainfall in Summer in <b>{Year}</b>'
        },
        'rfall_autumntotal': {
            desc: 'Rainfall Total in Autumn (mm)',
             html: '<br> This is the total amount of precipitation in Autumn. <br><br><b>Calculation:</b> <i> It is calculated by summing the daily amount of rainfall in September, October and November per year ', 
            legend: 'Rainfall Total in Autumn (mm): sum of rainfall in September, October and November per year',
            popup:  '<b>{Raster.ItemPixelValue}</b> mm of rainfall in Autumn in <b>{Year}</b>'
        },
        'rfall_wintertotal': {
            desc: 'Rainfall Total in Winter (mm)',
             html: '<br> This is the total amount of precipitation in Winter. <br><br><b>Calculation:</b> <i> It is calculated by summing the daily amount of rainfall in December (from the year before), January and February ', 
            legend: 'Rainfall Total in Winter (mm): sum of rainfall in December, January and February per year',
            popup:  '<b>{Raster.ItemPixelValue}</b> mm of rainfall in Winter in <b>{Year}</b>'
        },
        'rfall_jantotal': {
            desc: '&nbsp;&nbsp;-- rainfall in January',
            hideaway: 'Rainfall Total in January (mm)',
            html: '<br>This is the total amount of precipitation in a month. It is calculated by summing the daily amount of rainfall for January.', 
            legend: 'Rainfall Total in January (mm): sum of rainfall in January',
            popup: '<b>{Raster.ItemPixelValue}</b> mm of rainfall in January in <b>{Year}</b>'
        },
        'rfall_febtotal': {
            desc: '&nbsp;&nbsp;-- rainfall in February',
            hideaway: 'Rainfall Total in February (mm)',
            html: '<br>This is the total amount of precipitation in a month. It is calculated by summing the daily amount of rainfall for February.', 
            legend: 'Rainfall Total in February (mm): sum of rainfall in February',
            popup: '<b>{Raster.ItemPixelValue}</b> mm of rainfall in February in <b>{Year}</b>'
        },
        'rfall_martotal': {
            desc: '&nbsp;&nbsp;-- rainfall in March',
            hideaway: 'Rainfall Total in March (mm)',
            html: '<br>This is the total amount of precipitation in a month. It is calculated by summing the daily amount of rainfall for March.', 
            legend: 'Rainfall Total in March (mm): sum of rainfall in March',
            popup: '<b>{Raster.ItemPixelValue}</b> mm of rainfall in March in <b>{Year}</b>'
        },
        'rfall_aprtotal': {
            desc: '&nbsp;&nbsp;-- rainfall in April',
            hideaway: 'Rainfall Total in April (mm)',
            html: '<br>This is the total amount of precipitation in a month. It is calculated by summing the daily amount of rainfall for April.', 
            legend: 'Rainfall Total in April (mm): sum of rainfall in April',
            popup: '<b>{Raster.ItemPixelValue}</b> mm of rainfall in April in <b>{Year}</b>'
        },
        'rfall_maytotal': {
            desc: '&nbsp;&nbsp;-- rainfall in May',
            hideaway: 'Rainfall Total in May (mm)',
            html: '<br>This is the total amount of precipitation in a month. It is calculated by summing the daily amount of rainfall for May.', 
            legend: 'Rainfall Total in May (mm): sum of rainfall in May',
            popup: '<b>{Raster.ItemPixelValue}</b> mm of rainfall in May in <b>{Year}</b>'
        },
        'rfall_juntotal': {
            desc: '&nbsp;&nbsp;-- rainfall in June',
            hideaway: 'Rainfall Total in June (mm)',
            html: '<br>This is the total amount of precipitation in a month. It is calculated by summing the daily amount of rainfall for June.', 
            legend: 'Rainfall Total in June (mm): sum of rainfall in June',
            popup: '<b>{Raster.ItemPixelValue}</b> mm of rainfall in June in <b>{Year}</b>'
        },
        'rfall_jultotal': {
            desc: '&nbsp;&nbsp;-- rainfall in July',
            hideaway: 'Rainfall Total in July (mm)',
            html: '<br>This is the total amount of precipitation in a month. It is calculated by summing the daily amount of rainfall for July.', 
            legend: 'Rainfall Total in July (mm): sum of rainfall in July',
            popup: '<b>{Raster.ItemPixelValue}</b> mm of rainfall in July in <b>{Year}</b>'
        },
        'rfall_augtotal': {
            desc: '&nbsp;&nbsp;-- rainfall in August',
            hideaway: 'Rainfall Total in August (mm)',
            html: '<br>This is the total amount of precipitation in a month. It is calculated by summing the daily amount of rainfall for August.', 
            legend: 'Rainfall Total in August (mm): sum of rainfall in August',
            popup: '<b>{Raster.ItemPixelValue}</b> mm of rainfall in August in <b>{Year}</b>'
        },
        'rfall_septotal': {
            desc: '&nbsp;&nbsp;-- rainfall in September',
            hideaway: 'Rainfall Total in September (mm)',
            html: '<br>This is the total amount of precipitation in a month. It is calculated by summing the daily amount of rainfall for September.', 
            legend: 'Rainfall Total in September (mm): sum of rainfall in September',
            popup: '<b>{Raster.ItemPixelValue}</b> mm of rainfall in September in <b>{Year}</b>'
        },
        'rfall_octtotal': {
            desc: '&nbsp;&nbsp;-- rainfall in October',
            hideaway: 'Rainfall Total in October (mm)',
            html: '<br>This is the total amount of precipitation in a month. It is calculated by summing the daily amount of rainfall for October.', 
            legend: 'Rainfall Total in October (mm): sum of rainfall in October',
            popup: '<b>{Raster.ItemPixelValue}</b> mm of rainfall in October in <b>{Year}</b>'
        },
        'rfall_novtotal': {
            desc: '&nbsp;&nbsp;-- rainfall in November',
            hideaway: 'Rainfall Total in November (mm)',
            html: '<br>This is the total amount of precipitation in a month. It is calculated by summing the daily amount of rainfall for November.', 
            legend: 'Rainfall Total in November (mm): sum of rainfall in November',
            popup: '<b>{Raster.ItemPixelValue}</b> mm of rainfall in November in <b>{Year}</b>'
        },
        'rfall_dectotal': {
            desc: '&nbsp;&nbsp;-- rainfall in December',
            hideaway: 'Rainfall Total in December (mm)',
            html: '<br>This is the total amount of precipitation in a month. It is calculated by summing the daily amount of rainfall for December.', 
            legend: 'Rainfall Total in December (mm): sum of rainfall in December',
            popup: '<b>{Raster.ItemPixelValue}</b> mm of rainfall in December in <b>{Year}</b>'
        },
        'start_fieldops_doy': {
            desc: 'Start of Field Operations (day of year) ',
             html: '<br> The Start of Field Operations Indicator shows when management activities may be possible near the start of a year. It is based on the ‘Tsum 200’ often used by farmers as a ‘rule of thumb’ for this purpose. It is the time taken to accumulate ‘thermal time’ to 200 day degrees. However, it does not take into account the actual soil water status and other factors such as trafficability that will determine when machinery and livestock can access fields. <br><br><b>Calculation:</b> <i> Day when ∑Tavg from Jan 1st > 200\u00B0C ',
            legend: 'Start FieldOps (day of year): day when Tavg from 1 Jan > 200\u00B0C',
            popup: '<b>{Raster.ItemPixelValue}</b>th day of the year (out of 365) in <b>{Year}</b> when the sum of the daily average temperatures from 1 Jan is greater than 200\u00B0C'
        },
        'start_grow_doy': {
            desc: 'Start of Growing Season (day of year) ',
             html: '<br> The Start of the Growing Season Indicator shows approximately when in late winter or spring grass may start to grow (when the average temperature is above 5.6°C for 5 consecutive days). In actual terms colder periods may follow these 5 days, stopping growth again, but as an Indicator it is useful in providing evidence of changes in the start of plant growth and thus when and what crop management options may be possible. <br><br><b>Calculation:</b> <i> Day when 5 consecutive days Tavg > 5.6\u00B0C (from Jan 1st) ',
            legend: 'Start Grow (day of year): day when 5 consecutive days Tavg > 5.6\u00B0C',
            popup: '<b>{Raster.ItemPixelValue}</b>th day of the year (out of 365) in <b>{Year}</b> when five consecutive days have an average temperature greater than 5.6\u00B0C'
        },
        'tempgrowingperiod_length': {
            desc: 'Temp Growing Period (count of days)',
             html: '<br>Temp Growing Period (count of days): count of days between average 5 day temp > 5\u00B0C and average 5 day temp < 5\u00B0C where average daily temp greater than 5\u00B0C',
            legend: 'Temp Growing Period (count of days): count of days between average 5 day temp > 5\u00B0C and average 5 day temp < 5\u00B0C where average daily temp greater than 5\u00B0C',
            popup: '<b>{Raster.ItemPixelValue}</b> total days in <b>{Year}</b> between when the average five-day temperature is greater than 5\u00B0C and when the average five-day temperature is less than 5\u00B0C'
        },
        'thermaltime_sum': {
            desc: 'Thermal Time (degree days)',
             html: '<br> The Thermal Time Indicator shows the accumulation of thermal time from the fifth day in a five day period when daily mean temperature is above 5°C (e.g. in the spring) and when the mean temperature is less than 5°C. Thermal time accumulation is a good indicator of the heat energy input into biotic systems and determines how quickly plants and insects progress through their growth stages (phenology). <br><br><b>Calculation:</b> <i> ∑day degrees for period from 5th of 5 day period where Tavg > 5°C to end point where Tavg less than 5°C ',
            legend: 'Thermal Time (degree days): sum of day degrees for period from 5th of 5 day period where Tavg greater than 5\u00B0C to end point where Tavg less than 5\u00B0C',
            popup: '<b>{Raster.ItemPixelValue}</b> degree days in <b>{Year}</b> for the period from fifth day of a five-day period where the average temperater is greater than 5\u00B0C to the end point when the average temperature is less than 5\u00B0C'
        },
        'wet_count': {
            desc: 'Wet Day Count (count of days) ',
             html: '<br> The Wet Day Count Indicator is the number of days in a year when there is precipitation greater than 0.2mm per day. It shows the number of days per year when there is measureable rainfall. <br><br><b>Calculation:</b> <i> Count of days when daily P >= 0.2 mm ',
            legend: 'Wet Count (count of days): days when P >= 0.2 mm',
            popup: '<b>{Raster.ItemPixelValue}</b> total wet days in <b>{Year}</b> when precipitation is greater than or equal to 0.2 mm'
        },
        'wet_spell_n': {
            desc: 'Wet Spell (count of days)',
             html: '<br> The Wet Spell Indicator is the highest count of the number of consecutive days per year when precipitation is greater than 0.2mm. It shows how long the longest continuous period is when there is rainfall every day in a year. <br><br><b>Calculation:</b> <i> Maximum consecutive count of days when P > 0.2 mm ',
            legend: 'Wet Spell (count of days): max consecutive count P > 0.2 mm',
            popup: '<b>{Raster.ItemPixelValue}</b> total days in <b>{Year}</b> when the maximum consecutive count of precipitation is greater than 0.2 mm'
        },
        'wettestweek_doy': {
            desc: 'Wettest Week (day of year)',
             html: '<br> The Wettest Week Indicator shows the day of year when the wettest week occurs. It is the mid-week date when the largest rainfall occurs in a seven day period. <br><br><b>Calculation:</b> <i> Mid-week date when maximum 7 day value of P occurs',
            legend: 'Wettest Week (day of year): mid-week date when maximum 7d value of P occurs',
            popup: '<b>{Raster.ItemPixelValue}</b>th day of the year (out of 365) in <b>{Year}</b> when the maximum seven-day value of precipitation occurs'
        },
        'wettestweek_mm': {
            desc: 'Wettest Week (mm)',
            html: '<br> The Wettest Week Amount Indicator shows the maximum amount of rainfall in the Wettest Week (see Wettest Week Indicator). <br> <b>Calculation:</b> <i>Maximum amount of P (7 consecutive days) in the Wettest Week<i>',
            legend: 'Wettest Week (mm): Maximum amount of P (7 consecutive days)',
            popup: '<b>{Raster.ItemPixelValue}</b> mm of precipitation in <b>{Year}</b> calculated from the maximum amount of precipitation in seven consecutive days'
        }
    };


    const colorRamps = {
        'accumulatedfrost_degreedays' : colorBlue,
        'airfrost_count' : colorBlue,
        'cold_spell_n' : colorBlue,
        'dry_count' : colorRed,
        'dry_spell_n' : colorRed,
        'end_growingseason' : combineColorRamp,
        'first_airfrost_doy' : combineColorRamp,
        'first_grassfrost_doy' : combineColorRamp,
        'grassfrost_count' : combineColorRamp,
        'growing_degreedays' : combineColorRamp,
        'growing_season': combineColorRamp,
        'growseason_length' : combineColorRamp,
        'growseason_range': combineColorRamp,
        'heating_degreedays': combineColorRamp,
        'heatwave_n' : combineColorRamp,
        'last_airfrost_doy' : combineColorRamp,
        'last_grassfrost_doy' : combineColorRamp,
        'max_anntemp' : combineColorRamp,
        'max_jantemp' : combineColorRamp,
        'max_febtemp' : combineColorRamp,
        'max_martemp' : combineColorRamp,
        'max_aprtemp' : combineColorRamp,
        'max_maytemp' : combineColorRamp,
        'max_juntemp' : combineColorRamp,
        'max_jultemp' : combineColorRamp,
        'max_augtemp' : combineColorRamp,
        'max_septemp' : combineColorRamp,
        'max_octtemp' : combineColorRamp,
        'max_novtemp' : combineColorRamp,
        'max_dectemp' : combineColorRamp,
        'min_anntemp' : combineColorRamp,
        'min_jantemp' : combineColorRamp,
        'min_febtemp' : combineColorRamp,
        'min_martemp' : combineColorRamp,
        'min_aprtemp' : combineColorRamp,
        'min_maytemp' : combineColorRamp,
        'min_juntemp' : combineColorRamp,
        'min_jultemp' : combineColorRamp,
        'min_augtemp' : combineColorRamp,
        'min_septemp' : combineColorRamp,
        'min_octtemp' : combineColorRamp,
        'min_novtemp' : combineColorRamp,
        'min_dectemp' : combineColorRamp,
        'p_heterogeneity' : combineColorRamp,
        'p_intensity' : combineColorRamp,
        'p_seasonality' : combineColorRamp,
        'personheatstress_count' : combineColorRamp,
        'plantheatstress_count' : combineColorRamp,
        'rfall_annualtotal' : combineColorRamp,
        'rfall_springtotal' : combineColorRamp,
        'rfall_summertotal' : combineColorRamp,
        'rfall_autumntotal' : combineColorRamp,
        'rfall_wintertotal' : combineColorRamp,
        'rfall_jantotal' : combineColorRamp,
        'rfall_febtotal' : combineColorRamp,
        'rfall_martotal' : combineColorRamp,
        'rfall_aprtotal' : combineColorRamp,
        'rfall_maytotal' : combineColorRamp,
        'rfall_juntotal' : combineColorRamp,
        'rfall_jultotal' : combineColorRamp,
        'rfall_augtotal' : combineColorRamp,
        'rfall_septotal' : combineColorRamp,
        'rfall_octtotal' : combineColorRamp,
        'rfall_novtotal' : combineColorRamp,
        'rfall_dectotal' : combineColorRamp,
        'start_fieldops_doy' : combineColorRamp,
        'start_grow_doy' : combineColorRamp,
        'tempgrowingperiod_length' : combineColorRamp,
        'thermaltime_sum' : combineColorRamp,
        'wet_count' : combineColorRamp,
        'wet_spell_n' : combineColorRamp,
        'wettestweek_doy' : combineColorRamp,
        'wettestweek_mm' : combineColorRamp
    };

    const selectorExpression = [
        [`accumulatedfrost_degreedays`, indicators.accumulatedfrost_degreedays.desc],
        [`airfrost_count`, indicators.airfrost_count.desc],
        [`cold_spell_n`, indicators.cold_spell_n.desc], //PROBLEM WITH STATS
        [`dry_count`, indicators.dry_count.desc],
        [`dry_spell_n`, indicators.dry_spell_n.desc],
        [`end_growingseason`, indicators.end_growingseason.desc],
        [`first_airfrost_doy`, indicators.first_airfrost_doy.desc],
        [`first_grassfrost_doy`, indicators.first_grassfrost_doy.desc],
        [`grassfrost_count`, indicators.grassfrost_count.desc],
        [`growing_degreedays`, indicators.growing_degreedays.desc],
        [`growing_season`, indicators.growing_season.desc],
        [`growseason_length`, indicators.growseason_length.desc],
        [`growseason_range`, indicators.growseason_range.desc],
        [`heating_degreedays`, indicators.heating_degreedays.desc],
        [`heatwave_n`, indicators.heatwave_n.desc],
        [`last_airfrost_doy`, indicators.last_airfrost_doy.desc],
        [`last_grassfrost_doy`, indicators.last_grassfrost_doy.desc],
        [`max_anntemp`, indicators.max_anntemp.desc],
        [`max_jantemp`, indicators.max_jantemp.desc],
        [`max_febtemp`, indicators.max_febtemp.desc],
        [`max_martemp`, indicators.max_martemp.desc],
        [`max_aprtemp`, indicators.max_aprtemp.desc],
        [`max_maytemp`, indicators.max_maytemp.desc],
        [`max_juntemp`, indicators.max_juntemp.desc],
        [`max_jultemp`, indicators.max_jultemp.desc],
        [`max_augtemp`, indicators.max_augtemp.desc],
        [`max_septemp`, indicators.max_septemp.desc],
        [`max_octtemp`, indicators.max_octtemp.desc],
        [`max_novtemp`, indicators.max_novtemp.desc],
        [`max_dectemp`, indicators.max_dectemp.desc],
        [`min_anntemp`, indicators.min_anntemp.desc],
        [`min_jantemp`, indicators.min_jantemp.desc],
        [`min_febtemp`, indicators.min_febtemp.desc],
        [`min_martemp`, indicators.min_martemp.desc],
        [`min_aprtemp`, indicators.min_aprtemp.desc],
        [`min_maytemp`, indicators.min_maytemp.desc],
        [`min_juntemp`, indicators.min_juntemp.desc],
        [`min_jultemp`, indicators.min_jultemp.desc],
        [`min_augtemp`, indicators.min_augtemp.desc],
        [`min_septemp`, indicators.min_septemp.desc],
        [`min_octtemp`, indicators.min_octtemp.desc],
        [`min_novtemp`, indicators.min_novtemp.desc],
        [`min_dectemp`, indicators.min_dectemp.desc],
        [`p_heterogeneity`, indicators.p_heterogeneity.desc],
        [`p_intensity`, indicators.p_intensity.desc],
        [`p_seasonality`, indicators.p_seasonality.desc],
        [`personheatstress_count`, indicators.personheatstress_count.desc],
        [`plantheatstress_count`, indicators.plantheatstress_count.desc],
        ['rfall_annualtotal', indicators.rfall_annualtotal.desc],
        [`rfall_jantotal`, indicators.rfall_jantotal.desc],
        [`rfall_febtotal`, indicators.rfall_febtotal.desc],
        [`rfall_martotal`, indicators.rfall_martotal.desc],
        [`rfall_aprtotal`, indicators.rfall_aprtotal.desc],
        [`rfall_maytotal`, indicators.rfall_maytotal.desc],
        [`rfall_juntotal`, indicators.rfall_juntotal.desc],
        [`rfall_jultotal`, indicators.rfall_jultotal.desc],
        [`rfall_augtotal`, indicators.rfall_augtotal.desc],
        [`rfall_septotal`, indicators.rfall_septotal.desc],
        [`rfall_octtotal`, indicators.rfall_octtotal.desc],
        [`rfall_novtotal`, indicators.rfall_novtotal.desc],
        [`rfall_dectotal`, indicators.rfall_dectotal.desc],
        [`rfall_springtotal`, indicators.rfall_springtotal.desc],
        [`rfall_summertotal`, indicators.rfall_summertotal.desc],
        [`rfall_autumntotal`, indicators.rfall_autumntotal.desc],
        [`rfall_wintertotal`, indicators.rfall_wintertotal.desc],
        [`start_fieldops_doy`, indicators.start_fieldops_doy.desc],
        [`start_grow_doy`, indicators.start_grow_doy.desc],
        [`tempgrowingperiod_length`, indicators.tempgrowingperiod_length.desc],
        [`thermaltime_sum`, indicators.thermaltime_sum.desc], //PROBLEM WITH STATS
        [`wet_count`, indicators.wet_count.desc],
        [`wet_spell_n`, indicators.wet_spell_n.desc],
        [`wettestweek_doy`, indicators.wettestweek_doy.desc],
        [`wettestweek_mm`, indicators.wettestweek_mm.desc]
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
    selectFilter.value = 'plantheatstress_count';

    
    // add selectDivs to view
    view.ui.add(selectDiv, 'top-left');

    /******************************
     * selectorDiv configs
     * ****************************/
    //listen to change events on indicatorSelect and change multidimensional variable
    
    selectFilter.addEventListener('change', () => {
        const selectedIndicator = selectFilter.value;
        const selectedYear = parseInt(yearSlider.value);
        yearDefinition.values = [selectedYear];
        yearDefinition.variableName = selectedIndicator;
        changeIndicator(selectedIndicator);
        changeDescriptors(selectedIndicator);
        stopAnimation();
        closePopup();
    });

    function createRenderer(selectedIndicator) {
        const colorRamp = colorRamps[selectedIndicator];
        const renderer = new RasterStretchRenderer({
          colorRamp: colorRamp, 
          stretchType: 'min-max'
        });
        return renderer;
      };

    function changeIndicator(selectedIndicator) {
        // change mosaicRule of layer as clone and reassign
        const mosaicRuleClone = indicatorLayer.mosaicRule.clone(); // makes clone of layer's mosaicRule
        const indicatorVariable = mosaicRuleClone.multidimensionalDefinition[0];
        const renderer = createRenderer(selectedIndicator);

        indicatorVariable.values = yearSlider.get('values');
        indicatorVariable.variableName = selectedIndicator;

        mosaicRuleClone.multidimensionalDefinition = [indicatorVariable];
        indicatorLayer.mosaicRule = mosaicRuleClone;

        // change renderingRule (raster function) of layer as clone and reassign
        const renderingRuleClone = indicatorLayer.renderingRule.clone();
        renderingRuleClone.functionName = selectedIndicator;
        indicatorLayer.renderer = renderer;
        indicatorLayer.renderingRule = renderingRuleClone;
    };

    function changeDescriptors(selectedIndicator) {
        // change title of layer for Legend display
        indicatorLayer.title = indicators[selectedIndicator].legend;

        // change innerHTML of hideaway div
        const hideaway = document.getElementById('hideaway');
        const HTML30yrmaps = `
        <div id='imgGrid'>
            <div><p>1961-1990 Average</p><img src='img/${selectedIndicator}_avg1961_1990.png' alt=''></div>
            <div><p>1991-2018 Average</p><img src='img/${selectedIndicator}_avg1991_2020.png' alt=''></div>
            <div><p>2019-2050 Average</p><img src='img/${selectedIndicator}_avg2021_2050.png' alt=''></div>
            <div><p>2051-2080 Average</p><img src='img/${selectedIndicator}_avg2051_2080.png' alt=''></div>
        </div>`
        const htmlContent = indicators[selectedIndicator].html + HTML30yrmaps;

        if (indicators[selectedIndicator].desc.includes('--')) {
            hideaway.innerHTML = `<h2>${indicators[selectedIndicator].hideaway}</h2>${htmlContent}`
        } else {hideaway.innerHTML = `<h2>${indicators[selectedIndicator].desc}</h2>${htmlContent}`}
    
        // change popup contents
        const popupTemplateClone = indicatorLayer.popupTemplate.clone();
        popupTemplateClone.content = indicators[selectedIndicator].popup;
        indicatorLayer.popupTemplate = popupTemplateClone;
    };

    /************************************
     * Year Slider
     *************************************/
    const yearSlider = new Slider({
        container: 'yearSlider',
        min: 1961,
        max: 2080,
        values: [2021], // current value shown on load
        precision: 0,
        snapOnClickEnabled: true,
        visibleElements: {
            labels: true,
            rangeLabels: true
        },
        tickConfigs: [{
            mode: 'position',
            values: [1970, 1980, 1990, 2000, 2010, 2020, 2030, 2040, 2050, 2060, 2070, 2080],
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