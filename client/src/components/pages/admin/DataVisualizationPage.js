import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import ProgressBar from 'react-bootstrap/lib/Progressbar';
import Chart2 from './DonutChart';
import TestChart from './TestChart';

import { getUsers, getAlerts, getCategories} from 'actions';

require('./tableStyles.scss');

class DataVisualizationPage extends React.Component {

    constructor(props) {
        super(props);
        this.defaultState = {
            width: 0,
            lineChartData: [],
            needCount: 0
            
        }
        this.state = this.defaultState;
    }

    componentWillMount() {

        this.props.getUsers();
        this.props.getAlerts();
    }

    AlertRatio(alerts) {

        class ALertCount { // this class creates an object that stores the amount of each need request and sorts them 
            constructor(){
                this.itemSet = new Set();
                this.itemArray = [];
            }

            haveItem(item) {
                if(this.itemSet.has(item)){
                    return true;
                }
                return false;
            }

            insertItem(item){
                this.itemArray.push({"item": item, "count": 1});
                this.itemSet.add(item);
            }

            addItem(item){
                for(var i = 0; i < this.itemArray.length; i++){
                    if(this.itemArray[i].item == item){
                        this.itemArray[i].count++;
                    }
                }
            }

            sortMax(){
                for(var i = 1; i < this.itemArray.length; i++){
                    for(var j = 0; j < i; j++){
                        if(this.itemArray[j].count < this.itemArray[i].count){
                            console.log("swap")
                            var temp = this.itemArray[j];
                            this.itemArray[j] = this.itemArray[i];
                            this.itemArray[i] = temp;
                        }
                    }
                }
                return this.itemArray;
            }
        }
        var needCount = 0;
        var AlertCounts = new ALertCount();
        if(alerts.length > 0){
            for(var i = 0; i < alerts.length; i++){
                for(var j = 0; j < alerts[i].needs.length; j++){
                    needCount++;
                    var item = alerts[i].needs[j].name;
                    if(AlertCounts.haveItem(item)){
                        AlertCounts.addItem(item);
                    } else {
                        AlertCounts.insertItem(item);
                    }        
                }
            }

            var sortedAlerts = AlertCounts.sortMax();

            return sortedAlerts;
        } // stores all alert need counts in result object
        
    }

    filterRoles(users, role) {
        let results = users.filter(function(user) { return user.role == role});
        return results;
    }

    filterGender(alerts, gender){
        let results = alerts.filter(function(alert) { return alert.gender == gender});
        return results;
    }

    lineChartFilter(filter){
        let {users, current_user, alerts, categories} = this.props;
        if(filter == "alerts"){
            this.setState({lineChartData: alerts});
        } else if(filter == "users"){
            this.setState({lineChartData: users});
        } else if(filter == "successes"){
            this.setState({lineChartData: successes});
        } else if(filter == "needs"){
            this.setState({lineChartData: needs});
        }
        this.setState({});
    }

    dateFilter(oldDate){
    
        var lastWeek = new Date();
        lastWeek.setDate(lastWeek.getDate()-7);
        var s = oldDate.split('/');
        s[2] = "20" + s[2].split(' ')[0]
        var dateObj = new Date(s[2], s[0]-1, s[1]);
        
        if(dateObj <= lastWeek){
            return true;
        }
        return false;
    }

    AmountPrevious(values){
        if(values.length > 0){ 
            let self = this;
            var oldValues = values.filter(function(value) { return self.dateFilter.bind(value.created_at); });
            var percentIncrease = 0;
            if(values.length != oldValues.length){
                percentIncrease = oldValues / (values.length - oldValues);
            } 
            return percentIncrease; 
        }
    }

    render() {
        let {users, current_user, alerts, categories} = this.props;
        let advocates = this.filterRoles(users, "advocate");
        let providers = this.filterRoles(users, "provider");
        let admin = this.filterRoles(users, "admin");

        let advocatesAmount = advocates.length;
        let providersAmount = providers.length;
        let alertAmount = alerts.length;
        let userAmount = users.length;
       
        let alertAmountPrevious = this.AmountPrevious(alerts);
        let userAmountPrevious = this.AmountPrevious(users);
        let advocateAmountPrevious = this.AmountPrevious(advocates);
        let providerAmountPrevious = this.AmountPrevious(providers);


        //alert ratio top 5
        var needs = ""
        var alertRatioData = this.AlertRatio(alerts);
        var alertRatioDisplay = "";
   
        if(alertRatioData !== undefined){
            var needCount = 0;
            for(var i in alertRatioData){
                needCount = needCount + alertRatioData[i].count;
            }
            needs = needCount;
            alertRatioDisplay = alertRatioData.map(function(alert, i) {
            var colors = ["one", "two", "three", "four", "five"];
            return(
                <tr key={i}>
                    <td>
                        <p><i className={"fa fa-square " + colors[i]}  ></i>{alert.item}</p>
                    </td>
                    <td>{((alert.count) / needCount)*100}%</td>
                </tr>)
            });
        }

        // alert filters
        let alertsMale = this.filterGender(alerts, "male");
        let alertsFemale = this.filterGender(alerts, "female");

        if(this.state.lineChartData.length < 1){
        this.state.lineChartData = users;
        }

        var topData = [
                {class: "fa fa-user", label: "Total Advocates", data: advocatesAmount, dataChange: advocateAmountPrevious},
                {class: "fa fa-clock-o", label: "Average Response Time", data: 123.50, dataChange: 3},
                {class: "fa fa-user", label: "Total Providers", data: providersAmount, dataChange: providerAmountPrevious},
                {class: "fa fa-user", label: "Total Successes", data: 23, dataChange: 12},
                {class: "fa fa-users", label: "Total Items Requested", data: needs, dataChange: (needs-2)},
                {class: "fa fa-user", label: "Total Alerts", data: alertAmount, dataChange: alertAmountPrevious}
            ];

        var topDataDisplay = topData.map(function(data, i) { 
            return(
                <div className="col-md-2 col-sm-4 col-xs-6 tile_stats_count" key={i}>
                    <span className="count_top"><i className={data.class}></i>{data.label}</span>
                    <div className="count">{data.data}</div>
                    <span className="count_bottom"><i className="green"><i className="fa fa-sort-asc"></i>{data.dataChange}% </i> From last Week</span>
                </div>)
        });

       var topDataDisplayWrapper = (
            <div className="dashboard">
                <div className="row tile_count">
                    {topDataDisplay}
                </div>
            </div> 
            );

        var ProgressBarData = [
                {"label": "Shelter", "success": 23, "total": 6},
                {"label": "Clothes", "success": 70, "total": 10},
                {"label": "Food", "success": 87, "total": 12},
                {"label": "Other", "success": 66, "total": 15},
                ];

        var ProgressBarDisplay = ProgressBarData.map(function(data, i) {
            return(
                <div className="widget_summary" key={i}>
                    <div className="w_left w_25">
                        <span>{data.label}</span>
                    </div>
                    <div className="w_center w_55">
                        <div className="progress">
                            <ProgressBar now={data.success} label={`${data.success}%`} />
                        </div>
                    </div>
                    <div className="w_right w_20">
                        <span>{data.total}</span>
                    </div>
                    <div className="clearfix"></div>
                </div>)

        });

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
                                   <TestChart data={this.state.lineChartData} />

                                </div>
                            </div>
                            <div className="col-md-3 col-sm-3 col-xs-12 bg-white">
                                <div className="x_title">
                                    <h3>Filter By:</h3>
                                    <div className="clearfix"></div>
                                </div>
                                <div className="col-md-12 col-sm-12 col-xs-6">
                                    <div>
                                        <i className="fa fa-bar-chart"></i><button className="btn btn-default" type="button" onClick={() => { this.lineChartFilter("alerts") }}>Alerts</button>
                                    </div>
                                    <div>
                                        <i className="fa fa-bar-chart"></i><button className="btn btn-default" type="button" onClick={() => { this.lineChartFilter("users") }}>Users</button>                                    </div>
                                </div>
                                <div className="col-md-12 col-sm-12 col-xs-6"> 
                                    <div>
                                        <i className="fa fa-bar-chart"></i><button className="btn btn-default" type="button" onClick={() => { this.lineChartFilter("successes") }}>Successes</button>
                                    </div>
                                    <div>
                                        <i className="fa fa-bar-chart"></i><button className="btn btn-default" type="button" onClick={() => { this.lineChartFilter("needs") }}>Needs</button>
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
                            <h4>Response Rates</h4>
                                {ProgressBarDisplay}
                                </div>  
                            </div>
                        </div>

                        <div className="col-md-6 col-sm-6 col-xs-12">
                            <div className="x_panel tile fixed_height_320 overflow_hidden">
                                <div className="x_title">
                                    <h2>Alert Ratio</h2>
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
                                    <table className="" >
                                        <tr>
                                            <th>
                                                <p>Top Categories</p>
                                            </th>
                                            <th>
                                                <div className="col-lg-7 col-md-7 col-sm-7 col-xs-7">
                                                    <p className="">Categories</p>
                                                </div>
                                                <div className="col-lg-5 col-md-5 col-sm-5 col-xs-5">
                                                    <p className="">Percentage</p>
                                                </div>
                                            </th>
                                        </tr>
                                        <tr>
                                            <td>
                                                <div style={{width:'200px', height:'200px'}} id="donutchart">
                                                    <Chart2 data={alertRatioData} key={alertRatioData}/>
                                                </div>
                                                
                                            </td>
                                            <td>
                                                <table className="tile_info">
                                                    {alertRatioDisplay        }
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
                {topDataDisplayWrapper}
                {bottom}
            </div>
        )
    }
}


function mapStateToProps(state) {
    return {
        current_user: state.current_user,
        users: state.users,
        alerts: state.alerts,
        categories: state.categories
    }
}

export default connect(mapStateToProps, {
    getUsers, getAlerts, getCategories
})(DataVisualizationPage);