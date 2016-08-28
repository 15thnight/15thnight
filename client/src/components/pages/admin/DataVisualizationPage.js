import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import Chart1 from './LineChart';
import ProgressBar from 'react-bootstrap/lib/Progressbar';
import Chart2 from './DonutChart';

import { getUsers, getAlerts} from 'actions';

require('./tableStyles.scss');


class DataVisualizationPage extends React.Component {

    constructor(props) {
        super(props);
        this.defaultState = {
            width: 0,
            
        }

        this.state = this.defaultState;
    }

    componentWillMount() {
        this.props.getUsers();
        this.props.getAlerts();
    }

    filterAdvocates(users) {
        let advocates = users.filter(function(user) { return user.role == "advocate"});
        return advocates;
    }

    filterAdmin(users){
        let admin = users.filter(function(user) { return user.role == "admin"});
        return admin;
    }

    filterProviders(users){
        let providers = users.filter(function(user) { return user.role == "providers"});
        return providers;
    }

    alertAmountPrevious(alerts){
        console.log(alerts[0])
        var currentTime = new Date();

    }

    render() {
        let {users, current_user, alerts} = this.props;
        let advocates = this.filterAdvocates(users);
        let providers = this.filterProviders(users);
        let admin = this.filterAdmin(users);

        let advocatesAmount = advocates.length;
        let providersAmount = providers.length;
        let alertAmount = alert.length;
        let alertAmountPrevious = this.alertAmountPrevious(alerts);

        var dashboard;
        dashboard = (
            <div className="dashboard">
                <div className="row tile_count">
                    <div className="col-md-2 col-sm-4 col-xs-6 tile_stats_count">
                      <span className="count_top"><i className="fa fa-user"></i> Total Advocates</span>
                      <div className="count">{advocatesAmount}</div>
                      <span className="count_bottom"><i className="green">4% </i> From last Week</span>
                    </div>
                    <div className="col-md-2 col-sm-4 col-xs-6 tile_stats_count">
                      <span className="count_top"><i className="fa fa-clock-o"></i> Average Response Time</span>
                      <div className="count">123.50</div>
                      <span className="count_bottom"><i className="green"><i className="fa fa-sort-asc"></i>3% </i> From last Week</span>
                    </div>
                    <div className="col-md-2 col-sm-4 col-xs-6 tile_stats_count">
                      <span className="count_top"><i className="fa fa-user"></i> Total Providers</span>
                      <div className="count green">{providersAmount}</div>
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
                      <span className="count_top"><i className="fa fa-user"></i>Total Alerts</span>
                      <div className="count">{alertAmount}</div>
                      <span className="count_bottom"><i className="green"><i className="fa fa-sort-asc"></i>34% </i> From last Week</span>
                    </div>
              </div>
            

            </div> 
            );
            var bottom;
        var bottom = (
            <div className="row">
                <div className="col-md-12 col-sm-12 col-xs-12">
                    <div className="x_panel tile fixed_height_390" id="fixed_height_390">
                        <div className="row x_title">
                            <div className="col-md-6">
                            <h3>Network Activities <small>Graph title sub-title</small></h3>
                            </div>
                            <div className="col-md-9 col-sm-9 col-xs-12">
                                <div style={{width:'100%', height:'100%'}} id="test" className="test">
                                   <Chart1 users={users}/>
                                </div>
                            </div>
                            <div className="col-md-3 col-sm-3 col-xs-12 bg-white">
                                <div className="x_title">
                                    <h3>Filter By:</h3>
                                    <div className="clearfix"></div>
                                </div>
                                <div className="col-md-12 col-sm-12 col-xs-6">
                                    <div>
                                        <i className="fa fa-bar-chart"></i><a href="#">Alerts</a>
                                    </div>
                                    <div>
                                        <i className="fa fa-bar-chart"></i><a href="#">Advocates</a>
                                    </div>
                                </div>
                                <div className="col-md-12 col-sm-12 col-xs-6">
                                    <div>
                                        <i className="fa fa-bar-chart"></i><a href="#">Providers</a>
                                    </div>
                                    <div>
                                        <i className="fa fa-bar-chart"></i><a href="#">Successes</a>
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
                            <h2>Requested Items</h2>
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
                            <h4>Success Rates</h4>
                                <div className="widget_summary">
                                    <div className="w_left w_25">
                                        <span>Shoes</span>
                                    </div>
                                    <div className="w_center w_55">
                                        <div className="progress">
                                            <ProgressBar now={60} label={`${60}%`} />
                                        </div>
                                    </div>
                                    <div className="w_right w_20">
                                        <span>53k</span>
                                    </div>
                                    <div className="clearfix"></div>
                                </div>
                                <div className="widget_summary">
                                    <div className="w_left w_25">
                                        <span>Shelter</span>
                                    </div>
                                    <div className="w_center w_55">
                                        <div className="progress">
                                            <ProgressBar now={60} label={`${60}%`} />
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
                                            <ProgressBar now={60} label={`${60}%`} />
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
                                            <ProgressBar now={60} label={`${60}%`} />
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
                                            <ProgressBar now={60} label={`${60}%`} />
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
                                    <table className="" style={{width:'100%'}}>
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
                                                <div style={{width:'200px', height:'200px'}} id="donutchart">
                                                    <Chart2 />
                                                </div>
                                                
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
        current_user: state.current_user,
        users: state.users,
        alerts: state.alerts
    }
}

export default connect(mapStateToProps, {
    getUsers, getAlerts
})(DataVisualizationPage);