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

// Addin Ensembles

let map1 = {
    title: [], //The legend automatically updates when a layer's renderer, opacity, or title is changed
    url: 'https://abgis03.hutton.ac.uk:6443/arcgis/rest/services/Agmet/Ensemble5/ImageServer',
    mosaicRule: mosaicRule,
    renderer: countOfDayRenderer,
    renderingRule: serviceRasterFunction,
    opacity: 0.9,
    //blendMode: "multiply", //https://developers.arcgis.com/javascript/latest/sample-code/intro-blendmode-layer/
    popupTemplate: indicatorLayerPopupTemplate 
  };
  
  let map2 = {
    title: [], //The legend automatically updates when a layer's renderer, opacity, or title is changed
    url: 'https://abgis03.hutton.ac.uk:6443/arcgis/rest/services/Agmet/Ensemble4/ImageServer',
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
  
  // Add Selector
  const selector = document.createElement('select');
  const layerOptions = [
    { value: 'map1', text: 'Ensemble5' },
    { value: 'map2', text: 'Ensemble4' },
  ];
  layerOptions.forEach(option => {
    const optionElement = document.createElement('option');
    optionElement.value = option.value;
    optionElement.text = option.text;
    selector.add(optionElement);
  });
  view.ui.add(selector, 'top-right');
  
  // Listen to the value change event of the selector#
  selector.addEventListener('change', function() {
    // Update the selected map based on the selector's value
    if (this.value === 'map1') {
      selectedMap = map1;
    } else if (this.value === 'map2') {
      selectedMap = map2;
    }
  
    // Update the indicator layer with the selected map
    console.log('Selected map:', selectedMap);
    indicatorLayer.url = selectedMap.url;
    indicatorLayer.mosaicRule = selectedMap.mosaicRule;
    indicatorLayer.renderer = selectedMap.renderer;
    indicatorLayer.renderingRule = selectedMap.renderingRule;
    indicatorLayer.opacity = selectedMap.opacity;
    indicatorLayer.popupTemplate = selectedMap.popupTemplate;
    console.log('Indicator layer:', indicatorLayer);
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
            html: '', // '<p>Sum of degree days in a year when the minimum temperature is less than 0\u00B0C</p><p>Reduced amount of accumulated frost with a continued reduction in the future</p>',
            legend: 'Accumulated Frost (degree days): sum of degree days where Tmin < 0\u00B0C',
            popup: '<b>{Raster.ItemPixelValue}</b> degree days in <b>{Year}</b> when the minimum temperature is less than 0\u00B0C'
        },
        'airfrost_count': {
            desc: 'Air Frost (count of days)',
            html: '', // '<p>Number of days in a year when the minimum temperature is less than 0\u00B0C</p><p>Fewer air frost days in each year with a further reduction in air frost days (c. 12-15 in coastal, 30-40 in lowland and 40-50 in mountain areas).</p>',
            legend: 'Air Frost (count of days): count of days when Tmin < 0\u00B0C',
            popup: '<b>{Raster.ItemPixelValue}</b> total days in <b>{Year}</b> when the minimum temperature is less than 0\u00B0C'
        },
        'cold_spell_n': {
            desc: 'Cold Spell (count of days)',
             html: '', //  '<p>Consecutive days in a year when the maximum temperature is less than the average maximum temperature in a baseline year minus 3\u00B0C (where the minimum is not less than 6 days) </p><p>Reduction in the number of days when the minimum temperature is below the average minimum temperature (1961-1990 period) and less an additional -3\u00B0C for at least 6 consecutive days.</p><p>Reduction continues into the future and becomes geographically more uniform. </p>',
            legend: 'Cold Spell (count of days): Max count of consecutive days when Tmax < avgTmax (baseline year) - 3\u00B0C (min 6 days)',
            popup: '<b>{Raster.ItemPixelValue}</b> consecutive days in <b>{Year}</b> when the maximum temperature is less than the average maximum temperature in a baseline year minus 3\u00B0C'
        },
        'dry_count': {
            desc: 'Dry Count (count of days)',
             html: '', //  '<p>Number of days in a year when precipitation is less than 0.2 mm</p><p>Increasing number of dry days.</p><p>Continued large increase in number of dry days, particularly in the east.</p>',
            legend: 'Dry Count (count of days): count of days when P < 0.2 mm',
            popup: '<b>{Raster.ItemPixelValue}</b> total days in <b>{Year}</b> when precipitation is less than 0.2 mm '
        },
        'dry_spell_n': {
            desc: 'Dry Spell (count of days)',
             html: '', //  '<p>Number of consecutive days in a year when precipitation is less 0.2 mm</p><p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer vitae magna efficitur, tempus lacus facilisis, vestibulum urna.</p>',
            legend: 'Dry Spell (count of days): max consecutive count P < 0.2 mm',
            popup: '<b>{Raster.ItemPixelValue}</b> consecutive days in <b>{Year}</b> when precipitation is less than 0.2 mm'
        },
        'end_growingseason': {
            desc: 'End of Growing Season (day of year)',
             html: '', //  '<p>Day of the year (out of 365) when average temperature for five consecutive days is less than 5.6\u00B0C from 1 July</p><p>Shift towards later in the year.</p><p>Continues to occur later and more uniform spatial distribution of when in lowlands.</p>',
            legend: 'End of Growing Season (day of year): day when 5 consecutive days Tavg < 5.6\u00B0C from 1 July',
            popup: '<b>{Raster.ItemPixelValue}</b>th day of the year (out of 365) in <b>{Year}</b> when average temperature for five consecutive days is less than 5.6\u00B0C from 1 July'
        },
        'first_airfrost_doy': {
            desc: 'First Airfrost (day of year)',
             html: '', //  '<p>Day of the year (out of 365) when the minimum temperature is less than 0\u00B0C from 1 July</p><p>Shifted to occuring later in the year, reduced areas of early autumn frost.</p><p>Continuted shift towards occurring later in the year, largest changes in the upland areas.</p>',
            legend: 'First Airfrost (day of year): first day when Tmin < 0\u00B0C from 1 July',
            popup: '<b>{Raster.ItemPixelValue}</b>th day of the year (out of 365) in <b>{Year}</b> when the minimum temperature is less than 0\u00B0C from 1 July'
        },
        'first_grassfrost_doy': {
            desc: 'First Grassfrost (day of year)',
             html: '', //  '<p>Day of the year (out of 365) when the minimum temperature is less than 5\u00B0C from 1 July</p><p>First frost has shifted to later in the year.</p><p>Much reduced area of early frost and continuted shift to later in the year.</p>',
            legend: 'First Grassfrost (day of year): first day when Tmin < 5\u00B0C from 1 July',
            popup: '<b>{Raster.ItemPixelValue}</b>th day of the year (out of 365) in <b>{Year}</b> when the minimum temperature is less than 5\u00B0C from 1 July'
        },
        'grassfrost_count': {
            desc: 'Grassfrost Count (count of days)',
             html: '', //  '<p>Number of days in a year when the minimum temperature is less than 5\u00B0C</p><p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer vitae magna efficitur, tempus lacus facilisis, vestibulum urna. Morbi dignissim pulvinar enim in faucibus. Donec cursus consequat ex. Fusce lacinia faucibus magna in consequat.</p>',
            legend: 'Grassfrost (count of days): count of days when Tmin < 5\u00B0C',
            popup: '<b>{Raster.ItemPixelValue}</b> total days in <b>{Year}</b> when the minimum temperature is less than 5\u00B0C'
        },
        'growing_degreedays': {
            desc: 'Growing (degree days)',
             html: '', //  '<p>This is an accumulated sum for mean temperature <i>above</i> a threshold assumed to represent the temperature above which plants are photosynthetically active. A threshold of 5.6\u00B0C is used and the calculation is very similar to that of Heating Degree Days. For example, if the mean temperature for a day is 7.6\u00B0C this equates to 2.0 Growing Degree Days (GDD). Typical values in the early 1960\'s were approximately 950 GDD per annum in North Scotland, 1000 GDD per annum in East Scotland and 1150 GDD per annum in West Scotland. (<a href="https://www.sniffer.org.uk/Handlers/Download.ashx?IDMF=51c75256-1dbe-4086-9cb0-6f37999463a7#page=24" target="_blank" >source</a>)</a></p><p>Sum of degree days in a year when the average temperature is greater than 5.6\u00B0C</p><p>Slight increase in Scotland, large increase in lowland England.</p><p>Continued increase, particularly in lowland areas and southern UK.</p>',
            legend: 'Growing (degree days): sum Tavg > 5.6\u00B0C',
            popup: '<b>{Raster.ItemPixelValue}</b> degree days in <b>{Year}</b> when the average temperature is greater than 5.6\u00B0C'
        },
        'growing_season': {
            desc: 'Growing Season (count of days)',
             html: '', //  '<p>Number of days in a year when the temperature on five consecutive days exceeds 5\u00B0C, and ending when the temperature on five consecutive days is below 5\u00B0C</p><p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer vitae magna efficitur, tempus lacus facilisis, vestibulum urna. Morbi dignissim pulvinar enim in faucibus. Donec cursus consequat ex. Fusce lacinia faucibus magna in consequat.</p>',
            legend: 'Growing Season (count of days): beginning when the temperature on five consecutive days exceeds 5\u00B0C, and ending when the temperature on five consecutive days is below 5\u00B0C',
            popup: '<b>{Raster.ItemPixelValue}</b> total days in <b>{Year}</b> when the temperature on five consecutive days exceeds 5\u00B0C, and ending when the temperature on five consecutive days is below 5\u00B0C'
        },
        'growseason_length': {
            desc: 'Grow Season Length (count of days)',
             html: '', //  '<p>This is the number of days between the start and end of the growing season. Growing Start is calculated  as Julian days where the growing season is assumed to start on the 5th consecutive day with a mean temperature of 5\u00B0C or greater. Growing Season End is calculated in Julian days where the growing season is assumed to end ont the 5th consecutive day with a mean temperature of 5\u00B0C or less. (<a href="https://www.sniffer.org.uk/Handlers/Download.ashx?IDMF=51c75256-1dbe-4086-9cb0-6f37999463a7#page=25" target="_blank" >source</a>)</a></p><p>In the early 1960\'s typical values were a growing season of approximately 213 days in East Scotland, 217 days in North Scotland and 237 days in the West.</p><p>Number of days in a year when the average temperature is greater than 5.6\u00B0C between the start and the end of growing season</p><p>Slight shift to increased length.</p><p>Increase in growing season length, by 30+ days from 1960 to 1990 period.</p>',
            legend: 'Grow Season Length (count of days): days when Tavg > 5.6\u00B0C between start and end of growing season',
            popup: '<b>{Raster.ItemPixelValue}</b> total days in <b>{Year}</b> when the average temperature is greater than 5.6\u00B0C between the start and the end of growing season'
        },
       'growseason_range': {
            desc: 'Grow Season Range (count of days)',
             html: '', //  '<p>Number of days in a year between the start and the end of the growing season</p><p>Slight shift to longer growing season.</p><p>Continues to increase in length, most particularly for locations normally (in 1960 to 1990 period) with a shorter range.</p>',
            legend: 'Grow Season Range (count of days): days between start and end of growing season',
            popup: '<b>{Raster.ItemPixelValue}</b> total days in <b>{Year}</b> calculated from the count of days between the start and end of the growing season'
        },
        'heating_degreedays': {
            desc: 'Heating (degree days)',
             html: '', //  '<p>This is an indicator of household consumption of heat energy. The base temperature for calculation of a heating degree day is 15.5\u00B0C, such that if the mean temperature were <i>below</i> 15.5\u00B0C then the value of the Heating Degree Day (HDD) for that individual day would be 15.5\u00B0C minus the mean temperature. For example, if a day has a mean temperature of 13.5\u00B0C this is equivalent to 2.0 heating degree days. Typical figures at the start of the 1961 to 2018 period were approximately 3200 HDD per annum for North and East Scotland, and 2900 HDD per annum for West Scotland. (<a href="https://www.sniffer.org.uk/Handlers/Download.ashx?IDMF=51c75256-1dbe-4086-9cb0-6f37999463a7#page=24" target="_blank" >source</a>)</a></p><p>Degree days in a year representing the sum of 15.5\u00B0C minus the average temperature where the average temperature is less than 15.5\u00B0C</p><p>Reduction, with associated building heating requirments.</p><p>Further reduction, particularly in upland areas.</p>',
            legend: 'Heating (degree days): Sum of 15.5\u00B0C minus Tavg where Tavg < 15.5\u00B0C',
            popup: '<b>{Raster.ItemPixelValue}</b> degree days in <b>{Year}</b> representing the sum of 15.5\u00B0C minus the average temperature where the average temperature is less than 15.5\u00B0C'
        },
        'heatwave_n': {
            desc: 'Heatwave (count of days)',
             html: '', //  '<p>Number of days in a year when the maximum temperature is greater than the average temperature in a baseline year plus 3\u00B0C</p><p>Increasing number of heat wave days, particularly in southern UK.</p><p>Continued increase, particularly in lowland and coastal locations. Less change in Scotland than the rest of the UK.</p>',
            legend: 'Heatwave (count of days): Max count of consecutive days when Tmax > avgTmax (baseline year) + 3\u00B0C (min 6 days)',
            popup: '<b>{Raster.ItemPixelValue}</b> total days in <b>{Year}</b> when the maximum temperature is greater than the average temperature in a baseline year plus 3\u00B0C'
        },
        'last_airfrost_doy': {
            desc: 'Last Airfrost (day of year)',
             html: '', //  '<p>Last day of the year (out of 365) when the minimum temperature is less than 0\u00B0C before 1 July</p><p>Shifted to occurring earlier in the year for most lowland areas.</p><p>Large shift to earlier in the year in coastal and lowland Scotland.</p>',
            legend: 'Last Airfrost (day of year): last day when Tmin < 0\u00B0C before 1 July',
            popup: '<b>{Raster.ItemPixelValue}</b>th day of the year (out of 365) in <b>{Year}</b> when the minimum temperature is less than 0\u00B0C before 1 July'
        },
        'last_grassfrost_doy': {
            desc: 'Last Grassfrost (day of year)',
             html: '', //  '<p>Last day of the year (out of 365) when the minimum temperature is less than 5\u00B0C before 1 July</p><p>Shifted to occurring earlier in the year for most lowland areas.</p><p>Large shift to earlier in the year in coastal and lowland Scotland.</p>',
            legend: 'Last Grassfrost (day of year): last day when Tmin < 5\u00B0C before 1 July',
            popup: '<b>{Raster.ItemPixelValue}</b>th day of the year (out of 365) in <b>{Year}</b> when the minimum temperature is less than 5\u00B0C before 1 July'
        }, 
        'max_anntemp': {
            desc: 'Maximum Annual Temperature (\u00B0C)',
            html: '',
            legend: 'Maximum Annual Temperature (\u00B0C): highest temperature per year',
            popup: '<b>{Raster.ItemPixelValue}</b>\u00B0C is the highest temperature in <b>{Year}</b>'
        },
        'max_jantemp': {
            desc: '&nbsp;&nbsp;-- max temp in January',
            hideaway: 'Maximum Temperature in January (\u00B0C)',
            html: '',
            legend: 'Maximum Temperature in January (\u00B0C): highest temperature in January per year',
            popup: '<b>{Raster.ItemPixelValue}</b>\u00B0C is the highest temperature in January in <b>{Year}</b>'
        },
        'max_febtemp': {
            desc: '&nbsp;&nbsp;-- max temp in February',
            hideaway: 'Maximum Temperature in February (\u00B0C)',
            html: '',
            legend: 'Maximum Temperature in February (\u00B0C): highest temperature in February per year',
            popup: '<b>{Raster.ItemPixelValue}</b>\u00B0C is the highest temperature in February in <b>{Year}</b>'
        },
        'max_martemp': {
            desc: '&nbsp;&nbsp;-- max temp in March',
            hideaway: 'Maximum Temperature in March (\u00B0C)',
            html: '',
            legend: 'Maximum Temperature in March (\u00B0C): highest temperature in March per year',
            popup: '<b>{Raster.ItemPixelValue}</b>\u00B0C is the highest temperature in March in <b>{Year}</b>'
        },
        'max_aprtemp': {
            desc: '&nbsp;&nbsp;-- max temp in April',
            hideaway: 'Maximum Temperature in April (\u00B0C)',
            html: '',
            legend: 'Maximum Temperature in April (\u00B0C): highest temperature in April per year',
            popup: '<b>{Raster.ItemPixelValue}</b>\u00B0C is the highest temperature in April in <b>{Year}</b>'
        },
        'max_maytemp': {
            desc: '&nbsp;&nbsp;-- max temp in May',
            hideaway: 'Maximum Temperature in May (\u00B0C)',
            html: '',
            legend: 'Maximum Temperature in May (\u00B0C): highest temperature in May per year',
            popup: '<b>{Raster.ItemPixelValue}</b>\u00B0C is the highest temperature in May in <b>{Year}</b>'
        },
        'max_juntemp': {
            desc: '&nbsp;&nbsp;-- max temp in June',
            hideaway: 'Maximum Temperature in June (\u00B0C)',
            html: '',
            legend: 'Maximum Temperature in June (\u00B0C): highest temperature in June per year',
            popup: '<b>{Raster.ItemPixelValue}</b>\u00B0C is the highest temperature in June in <b>{Year}</b>'
        },
        'max_jultemp': {
            desc: '&nbsp;&nbsp;-- max temp in July',
            hideaway: 'Maximum Temperature in July (\u00B0C)',
            html: '',
            legend: 'Maximum Temperature in July (\u00B0C): highest temperature in July per year',
            popup: '<b>{Raster.ItemPixelValue}</b>\u00B0C is the highest temperature in July in <b>{Year}</b>'
        },
        'max_augtemp': {
            desc: '&nbsp;&nbsp;-- max temp in August',
            hideaway: 'Maximum Temperature in August (\u00B0C)',
            html: '',
            legend: 'Maximum Temperature in August (\u00B0C): highest temperature in August per year',
            popup: '<b>{Raster.ItemPixelValue}</b>\u00B0C is the highest temperature in August in <b>{Year}</b>'
        },
        'max_septemp': {
            desc: '&nbsp;&nbsp;-- max temp in September',
            hideaway: 'Maximum Temperature in September (\u00B0C)',
            html: '',
            legend: 'Maximum Temperature in September (\u00B0C): highest temperature in September per year',
            popup: '<b>{Raster.ItemPixelValue}</b>\u00B0C is the highest temperature in September in <b>{Year}</b>'
        },
        'max_octtemp': {
            desc: '&nbsp;&nbsp;-- max temp in October',
            hideaway: 'Maximum Temperature in October (\u00B0C)',
            html: '',
            legend: 'Maximum Temperature in October (\u00B0C): highest temperature in October per year',
            popup: '<b>{Raster.ItemPixelValue}</b>\u00B0C is the highest temperature in October in <b>{Year}</b>'
        },
        'max_novtemp': {
            desc: '&nbsp;&nbsp;-- max temp in November',
            hideaway: 'Maximum Temperature in November (\u00B0C)',
            html: '',
            legend: 'Maximum Temperature in November (\u00B0C): highest temperature in November per year',
            popup: '<b>{Raster.ItemPixelValue}</b>\u00B0C is the highest temperature in November in <b>{Year}</b>'
        },
        'max_dectemp': {
            desc: '&nbsp;&nbsp;-- max temp in December',
            hideaway: 'Maximum Temperature in December (\u00B0C)',
            html: '',
            legend: 'Maximum Temperature in December (\u00B0C): highest temperature in December per year',
            popup: '<b>{Raster.ItemPixelValue}</b>\u00B0C is the highest temperature in December in <b>{Year}</b>'
        },
        'min_anntemp': {
            desc: 'Minimum Annual Temperature',
            html: '',
            legend: 'Minimum Annual Temperature (\u00B0C): lowest temperature per year',
            popup: '<b>{Raster.ItemPixelValue}</b>\u00B0C is the lowest temperature in <b>{Year}</b>'
        },
        'min_jantemp': {
            desc: '&nbsp;&nbsp;-- min temp in January',
            hideaway: 'Minimum Temperature in January (\u00B0C)',
            html: '',
            legend: 'Minimum Temperature in January (\u00B0C): lowest temperature in January per year',
            popup: '<b>{Raster.ItemPixelValue}</b>\u00B0C is the lowest temperature in January in <b>{Year}</b>'
        },
        'min_febtemp': {
            desc: '&nbsp;&nbsp;-- min temp in February',
            hideaway: 'Minimum Temperature in February (\u00B0C)',
            html: '',
            legend: 'Minimum Temperature in February (\u00B0C): lowest temperature in February per year',
            popup: '<b>{Raster.ItemPixelValue}</b>\u00B0C is the lowest temperature in February in <b>{Year}</b>'
        },
        'min_martemp': {
            desc: '&nbsp;&nbsp;-- min temp in March',
            hideaway: 'Minimum Temperature in March (\u00B0C)',
            html: '',
            legend: 'Minimum Temperature in March (\u00B0C): lowest temperature in March per year',
            popup: '<b>{Raster.ItemPixelValue}</b>\u00B0C is the lowest temperature in March in <b>{Year}</b>'
        },
        'min_aprtemp': {
            desc: '&nbsp;&nbsp;-- min temp in April',
            hideaway: 'Minimum Temperature in April (\u00B0C)',
            html: '',
            legend: 'Minimum Temperature in April (\u00B0C): lowest temperature in April per year',
            popup: '<b>{Raster.ItemPixelValue}</b>\u00B0C is the lowest temperature in April in <b>{Year}</b>'
        },
        'min_maytemp': {
            desc: '&nbsp;&nbsp;-- min temp in May',
            hideaway: 'Minimum Temperature in May (\u00B0C)',
            html: '',
            legend: 'Minimum Temperature in May (\u00B0C): lowest temperature in May per year',
            popup: '<b>{Raster.ItemPixelValue}</b>\u00B0C is the lowest temperature in May in <b>{Year}</b>'
        },
        'min_juntemp': {
            desc: '&nbsp;&nbsp;-- min temp in June',
            hideaway: 'Minimum Temperature in June (\u00B0C)',
            html: '',
            legend: 'Minimum Temperature in June (\u00B0C): lowest temperature in June per year',
            popup: '<b>{Raster.ItemPixelValue}</b>\u00B0C is the lowest temperature in June in <b>{Year}</b>'
        },
        'min_jultemp': {
            desc: '&nbsp;&nbsp;-- min temp in July',
            hideaway: 'Minimum Temperature in July (\u00B0C)',
            html: '',
            legend: 'Minimum Temperature in July (\u00B0C): lowest temperature in July per year',
            popup: '<b>{Raster.ItemPixelValue}</b>\u00B0C is the lowest temperature in July in <b>{Year}</b>'
        },
        'min_augtemp': {
            desc: '&nbsp;&nbsp;-- min temp in August',
            hideaway: 'Minimum Temperature in August (\u00B0C)',
            html: '',
            legend: 'Minimum Temperature in August (\u00B0C): lowest temperature in August per year',
            popup: '<b>{Raster.ItemPixelValue}</b>\u00B0C is the lowest temperature in August in <b>{Year}</b>'
        },
        'min_septemp': {
            desc: '&nbsp;&nbsp;-- min temp in September',
            hideaway: 'Minimum Temperature in September (\u00B0C)',
            html: '',
            legend: 'Minimum Temperature in September (\u00B0C): lowest temperature in September per year',
            popup: '<b>{Raster.ItemPixelValue}</b>\u00B0C is the lowest temperature in September in <b>{Year}</b>'
        },
        'min_octtemp': {
            desc: '&nbsp;&nbsp;-- min temp in October',
            hideaway: 'Minimum Temperature in October (\u00B0C)',
            html: '',
            legend: 'Minimum Temperature in October (\u00B0C): lowest temperature in October per year',
            popup: '<b>{Raster.ItemPixelValue}</b>\u00B0C is the lowest temperature in October in <b>{Year}</b>'
        },
        'min_novtemp': {
            desc: '&nbsp;&nbsp;-- min temp in November',
            hideaway: 'Minimum Temperature in November (\u00B0C)',
            html: '',
            legend: 'Minimum Temperature in November (\u00B0C): lowest temperature in November per year',
            popup: '<b>{Raster.ItemPixelValue}</b>\u00B0C is the lowest temperature in November in <b>{Year}</b>'
        },
        'min_dectemp': {
            desc: '&nbsp;&nbsp;-- min temp in December',
            hideaway: 'Minimum Temperature in December (\u00B0C)',
            html: '',
            legend: 'Minimum Temperature in December (\u00B0C): lowest temperature in December per year',
            popup: '<b>{Raster.ItemPixelValue}</b>\u00B0C is the lowest temperature in December in <b>{Year}</b>'
        },
        'p_heterogeneity': {
            desc: 'P Heterogeneity (index)',
             html: '', //  '<p>Precipitation heterogeneity? Index of precipitation intensity in a year</p><p>Slight increase in values (rainfall erosivity) in upland areas.</p><p>Intensifes particularly in northwest Scotland, but some areas see a reduction.</p>',
            legend: 'P Heterogeneity (index): P > 0.2 / count days P > 0.2mm',
            popup: '<b>{Raster.ItemPixelValue}</b>: index of precipitation intensity in <b>{Year}</b>'
        },
        'p_intensity': {
            desc: 'P Intensity (index)',
             html: '', //  '<p>Precipitation heterogeneity? Index of precipitation intensity in a year</p><p>Slight increase in values (rainfall erosivity) in upland areas.</p><p>Intensifes particularly in northwest Scotland, but some areas see a reduction.</p>',
            legend: 'P Intensity (index): P > 0.2 / count days P > 0.2mm',
            popup: '<b>{Raster.ItemPixelValue}</b>: index of precipitation intensity in <b>{Year}</b>'
        },
       'p_seasonality': {
            desc: 'P Seasonality (index)',
             html: '', //  '<p>Precipitation Seasonality. Index of precipitation seasonality in a year</p><p>Some areas shifted to have more rain in the summer than the winter.</p><p>Whole UK except northern Scotland projected to have more in the summer than the winter.</p>',
            legend: 'P Seasonality (index): S = winter P - summer P / annual total P',
            popup: '<b>{Raster.ItemPixelValue}</b>: index of precipitation seasonality in <b>{Year}</b>'
        },
        'personheatstress_count': {
            desc: 'Person Heat Stress (count of days)',
             html: '', //  '<p>Number of days in a year when the maximum temperature is greater than 32\u00B0C</p><p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer vitae magna efficitur, tempus lacus facilisis, vestibulum urna. Morbi dignissim pulvinar enim in faucibus. Donec cursus consequat ex. Fusce lacinia faucibus magna in consequat.</p>',
            legend: 'Person Heat Stress (count of days): count of days when Tmax > 32\u00B0C',
            popup: '<b>{Raster.ItemPixelValue}</b> total days in <b>{Year}</b> when the maximum temperature is greater than 32\u00B0C'
        },
        'plantheatstress_count': {
            desc: 'Plant Heat Stress (count of days)',
             html: '', //  '<p>Number of days in a year when the maximum temperature is greater than 25\u00B0C</p><p>Slight increase in southern Scotland, large increase in south east England.</p><p>Further slight increase in northern UK, continued large increase (20 days +) in southern England.</p>',
            legend: 'Plant Heat Stress (count of days): count of days when Tmax > 25\u00B0C',
            popup: '<b>{Raster.ItemPixelValue}</b> total days in <b>{Year}</b> when the maximum temperature is greater than 25\u00B0C'
        },
        'rfall_annualtotal': {
            desc: 'Rainfall Annual Total (mm)',
             html: '', 
            legend: 'Rainfall Annual Total (mm): sum of rainfall per year',
            popup: '<b>{Raster.ItemPixelValue}</b> mm of rainfall in <b>{Year}</b>'
        },
        'rfall_springtotal': {
            desc: 'Rainfall Total in Spring (mm)',
             html: '', 
            legend: 'Rainfall Total in Spring (mm): sum of rainfall in March, April and May per year',
            popup: '<b>{Raster.ItemPixelValue}</b> mm of rainfall in Spring in <b>{Year}</b>'
        },
        'rfall_summertotal': {
            desc: 'Rainfall Total in Summer (mm)',
             html: '', 
            legend: 'Rainfall Total in Summer (mm): sum of rainfall in June, July and August per year',
            popup: '<b>{Raster.ItemPixelValue}</b> mm of rainfall in Summer in <b>{Year}</b>'
        },
        'rfall_autumntotal': {
            desc: 'Rainfall Total in Autumn (mm)',
             html: '', 
            legend: 'Rainfall Total in Autumn (mm): sum of rainfall in September, October and November per year',
            popup:  '<b>{Raster.ItemPixelValue}</b> mm of rainfall in Autumn in <b>{Year}</b>'
        },
        'rfall_wintertotal': {
            desc: 'Rainfall Total in Winter (mm)',
             html: '', 
            legend: 'Rainfall Total in Winter (mm): sum of rainfall in December, January and February per year',
            popup:  '<b>{Raster.ItemPixelValue}</b> mm of rainfall in Winter in <b>{Year}</b>'
        },
        'rfall_jantotal': {
            desc: '&nbsp;&nbsp;-- rainfall in January',
            hideaway: 'Rainfall Total in January (mm)',
            html: '', 
            legend: 'Rainfall Total in January (mm): sum of rainfall in January',
            popup: '<b>{Raster.ItemPixelValue}</b> mm of rainfall in January in <b>{Year}</b>'
        },
        'rfall_febtotal': {
            desc: '&nbsp;&nbsp;-- rainfall in February',
            hideaway: 'Rainfall Total in February (mm)',
            html: '', 
            legend: 'Rainfall Total in February (mm): sum of rainfall in February',
            popup: '<b>{Raster.ItemPixelValue}</b> mm of rainfall in February in <b>{Year}</b>'
        },
        'rfall_martotal': {
            desc: '&nbsp;&nbsp;-- rainfall in March',
            hideaway: 'Rainfall Total in March (mm)',
            html: '', 
            legend: 'Rainfall Total in March (mm): sum of rainfall in March',
            popup: '<b>{Raster.ItemPixelValue}</b> mm of rainfall in March in <b>{Year}</b>'
        },
        'rfall_aprtotal': {
            desc: '&nbsp;&nbsp;-- rainfall in April',
            hideaway: 'Rainfall Total in April (mm)',
            html: '', 
            legend: 'Rainfall Total in April (mm): sum of rainfall in April',
            popup: '<b>{Raster.ItemPixelValue}</b> mm of rainfall in April in <b>{Year}</b>'
        },
        'rfall_maytotal': {
            desc: '&nbsp;&nbsp;-- rainfall in May',
            hideaway: 'Rainfall Total in May (mm)',
            html: '', 
            legend: 'Rainfall Total in May (mm): sum of rainfall in May',
            popup: '<b>{Raster.ItemPixelValue}</b> mm of rainfall in May in <b>{Year}</b>'
        },
        'rfall_juntotal': {
            desc: '&nbsp;&nbsp;-- rainfall in June',
            hideaway: 'Rainfall Total in June (mm)',
            html: '', 
            legend: 'Rainfall Total in June (mm): sum of rainfall in June',
            popup: '<b>{Raster.ItemPixelValue}</b> mm of rainfall in June in <b>{Year}</b>'
        },
        'rfall_jultotal': {
            desc: '&nbsp;&nbsp;-- rainfall in July',
            hideaway: 'Rainfall Total in July (mm)',
            html: '', 
            legend: 'Rainfall Total in July (mm): sum of rainfall in July',
            popup: '<b>{Raster.ItemPixelValue}</b> mm of rainfall in July in <b>{Year}</b>'
        },
        'rfall_augtotal': {
            desc: '&nbsp;&nbsp;-- rainfall in August',
            hideaway: 'Rainfall Total in August (mm)',
            html: '', 
            legend: 'Rainfall Total in August (mm): sum of rainfall in August',
            popup: '<b>{Raster.ItemPixelValue}</b> mm of rainfall in August in <b>{Year}</b>'
        },
        'rfall_septotal': {
            desc: '&nbsp;&nbsp;-- rainfall in September',
            hideaway: 'Rainfall Total in September (mm)',
            html: '', 
            legend: 'Rainfall Total in September (mm): sum of rainfall in September',
            popup: '<b>{Raster.ItemPixelValue}</b> mm of rainfall in September in <b>{Year}</b>'
        },
        'rfall_octtotal': {
            desc: '&nbsp;&nbsp;-- rainfall in October',
            hideaway: 'Rainfall Total in October (mm)',
            html: '', 
            legend: 'Rainfall Total in October (mm): sum of rainfall in October',
            popup: '<b>{Raster.ItemPixelValue}</b> mm of rainfall in October in <b>{Year}</b>'
        },
        'rfall_novtotal': {
            desc: '&nbsp;&nbsp;-- rainfall in November',
            hideaway: 'Rainfall Total in November (mm)',
            html: '', 
            legend: 'Rainfall Total in November (mm): sum of rainfall in November',
            popup: '<b>{Raster.ItemPixelValue}</b> mm of rainfall in November in <b>{Year}</b>'
        },
        'rfall_dectotal': {
            desc: '&nbsp;&nbsp;-- rainfall in December',
            hideaway: 'Rainfall Total in December (mm)',
            html: '', 
            legend: 'Rainfall Total in December (mm): sum of rainfall in December',
            popup: '<b>{Raster.ItemPixelValue}</b> mm of rainfall in December in <b>{Year}</b>'
        },
        'start_fieldops_doy': {
            desc: 'Start FieldOps (day of year)',
             html: '', //  '<p>Day of the year (out of 365) when the sum of the daily average temperatures from 1 Jan is greater than 200\u00B0C, indicating the start of Field Operations</p><p>Shifted to occur earlier in the year.</p><p>Continues to occur earlier and more uniform spatial distriction of when in lowlands.</p>',
            legend: 'Start FieldOps (day of year): day when Tavg from 1 Jan > 200\u00B0C',
            popup: '<b>{Raster.ItemPixelValue}</b>th day of the year (out of 365) in <b>{Year}</b> when the sum of the daily average temperatures from 1 Jan is greater than 200\u00B0C'
        },
        'start_grow_doy': {
            desc: 'Start Grow (day of year)',
             html: '', //  '<p>Day of the year (out of 365) when five consecutive days have an average temperature greater than 5.6\u00B0C</p><p>Shifted to occurring earlier in the year.</p><p>Continues to occur earlier, most particularly for location normally (in 1961-1990 period) with a later start date.</p>',
            legend: 'Start Grow (day of year): day when 5 consecutive days Tavg > 5.6\u00B0C',
            popup: '<b>{Raster.ItemPixelValue}</b>th day of the year (out of 365) in <b>{Year}</b> when five consecutive days have an average temperature greater than 5.6\u00B0C'
        },
        'tempgrowingperiod_length': {
            desc: 'Temp Growing Period (count of days)',
             html: '', //  '<p>Number of days in a year between the average five-day temperature being greater than 5\u00B0C and the average five-day temperature being less than 5\u00B0C</p><p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer vitae magna efficitur, tempus lacus facilisis, vestibulum urna. Morbi dignissim pulvinar enim in faucibus. Donec cursus consequat ex. Fusce lacinia faucibus magna in consequat.</p>',
            legend: 'Temp Growing Period (count of days): count of days between average 5 day temp > 5\u00B0C and average 5 day temp < 5\u00B0C where average daily temp greater than 5\u00B0C',
            popup: '<b>{Raster.ItemPixelValue}</b> total days in <b>{Year}</b> between when the average five-day temperature is greater than 5\u00B0C and when the average five-day temperature is less than 5\u00B0C'
        },
        'thermaltime_sum': {
            desc: 'Thermal Time (degree days)',
             html: '', //  '<p></p><p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer vitae magna efficitur, tempus lacus facilisis, vestibulum urna. Morbi dignissim pulvinar enim in faucibus. Donec cursus consequat ex. Fusce lacinia faucibus magna in consequat.</p>',
            legend: 'Thermal Time (degree days): sum of day degrees for period from 5th of 5 day period where Tavg greater than 5\u00B0C to end point where Tavg less than 5\u00B0C',
            popup: '<b>{Raster.ItemPixelValue}</b> degree days in <b>{Year}</b> for the period from fifth day of a five-day period where the average temperater is greater than 5\u00B0C to the end point when the average temperature is less than 5\u00B0C'
        },
        'wet_count': {
            desc: 'Wet Count (count of days)',
             html: '', //  '<p>Wet Days</p><p>Reduction in the number of wet days.</p><p>Extenuation of rain shadow effect, with further reduction in wet days, particularly in the west?</p>',
            legend: 'Wet Count (count of days): days when P >= 0.2 mm',
            popup: '<b>{Raster.ItemPixelValue}</b> total wet days in <b>{Year}</b> when precipitation is greater than or equal to 0.2 mm'
        },
        'wet_spell_n': {
            desc: 'Wet Spell (count of days)',
             html: '', //  '<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer vitae magna efficitur, tempus lacus facilisis, vestibulum urna. Morbi dignissim pulvinar enim in faucibus. Donec cursus consequat ex. Fusce lacinia faucibus magna in consequat.</p>',
            legend: 'Wet Spell (count of days): max consecutive count P > 0.2 mm',
            popup: '<b>{Raster.ItemPixelValue}</b> total days in <b>{Year}</b> when the maximum consecutive count of precipitation is greater than 0.2 mm'
        },
        'wettestweek_doy': {
            desc: 'Wettest Week (day of year)',
             html: '', //  '<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer vitae magna efficitur, tempus lacus facilisis, vestibulum urna. Morbi dignissim pulvinar enim in faucibus. Donec cursus consequat ex. Fusce lacinia faucibus magna in consequat.</p>',
            legend: 'Wettest Week (day of year): mid-week date when maximum 7d value of P occurs',
            popup: '<b>{Raster.ItemPixelValue}</b>th day of the year (out of 365) in <b>{Year}</b> when the maximum seven-day value of precipitation occurs'
        },
        'wettestweek_mm': {
            desc: 'Wettest Week (mm)',
            html: '<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer vitae magna efficitur, tempus lacus facilisis, vestibulum urna. Morbi dignissim pulvinar enim in faucibus. Donec cursus consequat ex. Fusce lacinia faucibus magna in consequat.</p>',
            legend: 'Wettest Week (mm): Maximum amount of P (7 consecutive days)',
            popup: '<b>{Raster.ItemPixelValue}</b> mm of precipitation in <b>{Year}</b> calculated from the maximum amount of precipitation in seven consecutive days'
        }
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
        let chosenIndicator = selectFilter.value;

        changeIndicator(chosenIndicator);
        changeDescriptors(chosenIndicator);
        stopAnimation();
        closePopup();
    });

    function changeIndicator(chosenIndicator) {
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