import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import Chart1 from './LineChart';

import { getServices } from 'actions';

require('./tableStyles.scss');


class DataVisualizationPage extends React.Component {

    render() {
        var dashboard;
        dashboard = (
            <div className="dashboard">
                <div className="row tile_count">
                    <div className="col-md-2 col-sm-4 col-xs-6 tile_stats_count">
                      <span className="count_top"><i className="fa fa-user"></i> Total Advocates</span>
                      <div className="count">2500</div>
                      <span className="count_bottom"><i className="green">4% </i> From last Week</span>
                    </div>
                    <div className="col-md-2 col-sm-4 col-xs-6 tile_stats_count">
                      <span className="count_top"><i className="fa fa-clock-o"></i> Average Time</span>
                      <div className="count">123.50</div>
                      <span className="count_bottom"><i className="green"><i className="fa fa-sort-asc"></i>3% </i> From last Week</span>
                    </div>
                    <div className="col-md-2 col-sm-4 col-xs-6 tile_stats_count">
                      <span className="count_top"><i className="fa fa-user"></i> Total Males</span>
                      <div className="count green">2,500</div>
                      <span className="count_bottom"><i className="green"><i className="fa fa-sort-asc"></i>34% </i> From last Week</span>
                    </div>
                    <div className="col-md-2 col-sm-4 col-xs-6 tile_stats_count">
                      <span className="count_top"><i className="fa fa-user"></i> Total Females</span>
                      <div className="count">4,567</div>
                      <span className="count_bottom"><i className="red"><i className="fa fa-sort-desc"></i>12% </i> From last Week</span>
                    </div>
                    <div className="col-md-2 col-sm-4 col-xs-6 tile_stats_count">
                      <span className="count_top"><i className="fa fa-user"></i> Total Collections</span>
                      <div className="count">2,315</div>
                      <span className="count_bottom"><i className="green"><i className="fa fa-sort-asc"></i>34% </i> From last Week</span>
                    </div>
                    <div className="col-md-2 col-sm-4 col-xs-6 tile_stats_count">
                      <span className="count_top"><i className="fa fa-user"></i> Total Connections</span>
                      <div className="count">7,325</div>
                      <span className="count_bottom"><i className="green"><i className="fa fa-sort-asc"></i>34% </i> From last Week</span>
                    </div>
              </div>
            

            </div> 
            );
            var bottom;
        var bottom = (
            <div className="row">
                <div className="col-md-12 col-sm-12 col-xs-12">
                    <div className="x_panel tile fixed_height_320">
                        <div className="row x_title">
                            <div className="col-md-6">
                            <h3>Network Activities <small>Graph title sub-title</small></h3>
                            </div>
                            <div className="col-md-9 col-sm-9 col-xs-12">
                                <div style={{width:'100%'}} id="test" className="test">
                                   <Chart1/>
                                </div>
                            </div>
                            <div className="col-md-3 col-sm-3 col-xs-12 bg-white">
                                <div className="x_title">
                                    <h3>Top Campaign Performance</h3>
                                    <div className="clearfix"></div>
                                </div>
                                <div className="col-md-12 col-sm-12 col-xs-6">
                                    <div>
                                        <i className="fa fa-bar-chart"></i><a href="#">Filter</a>
                                    </div>
                                    <div>
                                        <i className="fa fa-bar-chart"></i><a href="#">Filter</a>
                                    </div>
                                </div>
                                <div className="col-md-12 col-sm-12 col-xs-6">
                                    <div>
                                        <i className="fa fa-bar-chart"></i><a href="#">Filter</a>
                                    </div>
                                    <div>
                                        <i className="fa fa-bar-chart"></i><a href="#">Filter</a>
                                    </div>
                                </div>
                                <div className="clearfix"></div>
                            </div>


                            </div>
                        </div>
                    </div>

                <div className="col-md-4 col-sm-4 col-xs-12">
                    <div className="x_panel tile fixed_height_320">
                        <div className="x_title">
                            <h2>App Versions</h2>
                            <ul className="nav navbar-right panel_toolbox">
                                <li><a className="collapse-link"><i className="fa fa-chevron-up"></i></a>
                                </li>
                                <li className="dropdown">
                                    <a href="#" className="dropdown-toggle" data-toggle="dropdown" role="button" aria-expanded="false"><i className="fa fa-wrench"></i></a>
                                    <ul className="dropdown-menu" role="menu">
                                        <li><a href="#">Settings 1</a>
                                        </li>
                                        <li><a href="#">Settings 2</a>
                                        </li>
                                    </ul>
                                </li>
                                <li><a className="close-link"><i className="fa fa-close"></i></a>
                                </li>
                            </ul>
                            <div className="clearfix"></div>
                        </div>

                        <div className="x_content">
                            <h4>App Usage across versions</h4>


                                <div className="widget_summary">
                                    <div className="w_left w_25">
                                        <span>0.1.5.3</span>
                                    </div>
                                    <div className="w_center w_55">
                                        <div className="progress">
                                            <div className="progress-bar bg-green" role="progressbar" aria-valuenow="60" aria-valuemax="100" styles="width: 45%;">
                                                <span className="sr-only">60% Complete</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="w_right w_20">
                                        <span>53k</span>
                                    </div>
                                    <div className="clearfix"></div>
                                </div>
                                <div className="widget_summary">
                                    <div className="w_left w_25">
                                        <span>0.1.5.3</span>
                                    </div>
                                    <div className="w_center w_55">
                                        <div className="progress">
                                            <div className="progress-bar bg-green" role="progressbar" aria-valuenow="60" aria-valuemax="100" styles="width: 45%;">
                                                <span className="sr-only">60% Complete</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="w_right w_20">
                                        <span>53k</span>
                                    </div>
                                    <div className="clearfix"></div>
                                </div>
                                <div className="widget_summary">
                                    <div className="w_left w_25">
                                        <span>0.1.5.3</span>
                                    </div>
                                    <div className="w_center w_55">
                                        <div className="progress">
                                            <div className="progress-bar bg-green" role="progressbar" aria-valuenow="60" aria-valuemax="100" styles="width: 45%;">
                                                <span className="sr-only">60% Complete</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="w_right w_20">
                                        <span>53k</span>
                                    </div>
                                    <div className="clearfix"></div>
                                </div>
                                <div className="widget_summary">
                                    <div className="w_left w_25">
                                        <span>0.1.5.3</span>
                                    </div>
                                    <div className="w_center w_55">
                                        <div className="progress">
                                            <div className="progress-bar bg-green" role="progressbar" aria-valuenow="60" aria-valuemax="100" styles="width: 45%;">
                                                <span className="sr-only">60% Complete</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="w_right w_20">
                                        <span>53k</span>
                                    </div>
                                    <div className="clearfix"></div>
                                </div>
                                <div className="widget_summary">
                                    <div className="w_left w_25">
                                        <span>0.1.5.3</span>
                                    </div>
                                    <div className="w_center w_55">
                                        <div className="progress">
                                            <div className="progress-bar bg-green" role="progressbar" aria-valuenow="60" aria-valuemax="100" styles="width: 45%;">
                                                <span className="sr-only">60% Complete</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="w_right w_20">
                                        <span>53k</span>
                                    </div>
                                    <div className="clearfix"></div>
                                </div>

              
                                </div>  
                            </div>
                        </div>

                        <div className="col-md-4 col-sm-4 col-xs-12">
                            <div className="x_panel tile fixed_height_320 overflow_hidden">
                                <div className="x_title">
                                    <h2>Device Usage</h2>
                                    <ul className="nav navbar-right panel_toolbox">
                                        <li><a className="collapse-link"><i className="fa fa-chevron-up"></i></a></li>
                                        <li className="dropdown">
                                            <a href="#" className="dropdown-toggle" data-toggle="dropdown" role="button" aria-expanded="false"><i className="fa fa-wrench"></i></a>
                                            <ul className="dropdown-menu" role="menu">
                                                <li><a href="#">Settings 1</a></li>
                                                <li><a href="#">Settings 2</a></li>
                                            </ul>
                                        </li>
                                        <li><a className="close-link"><i className="fa fa-close"></i></a></li>
                                    </ul>
                                    <div className="clearfix"></div>
                                </div>
                                <div className="x_content">
                                    <table className="" styles="width:100%">
                                        <tr>
                                            <th styles="width:37%">
                                                <p>Top 5</p>
                                            </th>
                                            <th>
                                                <div className="col-lg-7 col-md-7 col-sm-7 col-xs-7">
                                                    <p className="">Device</p>
                                                </div>
                                                <div className="col-lg-5 col-md-5 col-sm-5 col-xs-5">
                                                    <p className="">Progress</p>
                                                </div>
                                            </th>
                                        </tr>
                                        <tr>
                                            <td>
                                                <canvas id="canvas1" height="140" width="140" styles="margin: 15px 10px 10px 0"></canvas>
                                                
                                            </td>
                                            <td>
                                                <table className="tile_info">
                                                    <tr>
                                                        <td>
                                                            <p><i className="fa fa-square blue"></i>IOS</p>
                                                        </td>
                                                        <td>30%</td>
                                                    </tr>
                                                    <tr>
                                                        <td>
                                                            <p><i className="fa fa-square green"></i>Android</p>
                                                        </td>
                                                        <td>10%</td>
                                                    </tr>
                                                    <tr>
                                                        <td>
                                                          <p><i className="fa fa-square purple"></i>Blackberry </p>
                                                        </td>
                                                        <td>20%</td>
                                                      </tr>
                                                      <tr>
                                                        <td>
                                                          <p><i className="fa fa-square aero"></i>Symbian </p>
                                                        </td>
                                                        <td>15%</td>
                                                      </tr>
                                                      <tr>
                                                        <td>
                                                          <p><i className="fa fa-square red"></i>Others </p>
                                                        </td>
                                                        <td>30%</td>
                                                      </tr>
                                                </table>
                                            </td>
                                        </tr>
                                    </table>
                                </div>
                            </div>
                        </div>

                        <div className="col-md-4 col-sm-4 col-xs-12">
                            <div className="x_panel tile fixed_height_320">
                                <div className="x_title">
                                    <h2>Quick Settings</h2>
                                    <ul className="nav navbar-right panel_toolbox">
                                        <li><a className="collapse-link"><i className="fa fa-chevron-up"></i></a>
                                            </li>
                                            <li className="dropdown">
                                              <a href="#" className="dropdown-toggle" data-toggle="dropdown" role="button" aria-expanded="false"><i className="fa fa-wrench"></i></a>
                                              <ul className="dropdown-menu" role="menu">
                                                <li><a href="#">Settings 1</a>
                                                </li>
                                                <li><a href="#">Settings 2</a>
                                                </li>
                                              </ul>
                                            </li>
                                            <li><a className="close-link"><i className="fa fa-close"></i></a>
                                            </li>
                                    </ul>
                                    <div className="clearfix"></div>
                                </div>
                                <div className="x_content">
                                    
                                </div>
                            </div>
                        </div>

                    </div>


                

            );
        console.log('DataVisualizationPage...');
        return (
            <div className="container">
                {dashboard}
                {bottom}
            </div>
        )
    }
}


function mapStateToProps(state) {
    return {
        services: state.services
    }
}

export default connect(mapStateToProps, {
    getServices
})(DataVisualizationPage);