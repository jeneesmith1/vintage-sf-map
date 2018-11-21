import React, {Component} from 'react';
import {Map, InfoWindow, GoogleApiWrapper} from 'google-maps-react';
import NoMapDisplay from './NoMapDisplay';

const MAP_KEY = "AIzaSyDS7YfVRAW-wyih2K_EmjB7rPO0qhZOWJ0";

class MapDisplay extends Component {
    state = {
        map: null,
        markers: [],
        markerProps: [],
        activeMarker: null,
        activeMarkerProps: null,
        showingInfoWindow: false
    };

    componentDidMount = () => {}

    componentWillReceiveProps = (props) => {
        this.setState({firstDrop: false});

        // Change in the number of locations, so update the markers
        if (this.state.markers.length !== props.locations.length) {
            this.closeInfoWindow();
            this.updateMarkers(props.locations);
            this.setState({activeMarker: null});

            return;
        }

        // The selected item is not the same as the active marker, so close the info window
        if (!props.selectedIndex || (this.state.activeMarker && 
            (this.state.markers[props.selectedIndex] !== this.state.activeMarker))) {
            this.closeInfoWindow();
        }

        // Make sure there's a selected index
        if (props.selectedIndex === null || typeof(props.selectedIndex) === "undefined") {
            return;
        };

        // Treat the marker as clicked
        this.onMarkerClick(this.state.markerProps[props.selectedIndex], this.state.markers[props.selectedIndex]);
    }

    mapReady = (props, map) => {
        // Save the map reference in state and prepare the location markers
        this.setState({map});
        this.updateMarkers(this.props.locations);
    }

    closeInfoWindow = () => {
        // Disable any active marker animation
        this.state.activeMarker && this
            .state
            .activeMarker
            .setAnimation(null);
        this.setState({showingInfoWindow: false, activeMarker: null, activeMarkerProps: null});
    }

    onMarkerClick = (props, marker, e) => {
        // Close any info window already open
        this.closeInfoWindow();

        //fetch yelp data for restaurant
        let yelpUrl = `https://api.yelp.com/v3/businesses/${props.yelp}`
   let activeMarkerProps;

    let myHeaders = new Headers();
    myHeaders.append("Authorization", "Bearer -AwvWSCwMZLmmmJEGhuTU7Cn8Qw6XPASlECYeqZXAvQMCXZyORj7jntKpFhd3oTKhuI87AgKJKjBEal-OssjuelJqMkcQLyad8uhCgOw36YgMP79UeVdUo6yUF_qW3Yx");
    
  
    const proxyurl = "https://cors-anywhere.herokuapp.com/";
    const request = yelpUrl; // site that doesn’t send Access-Control-*
    fetch(proxyurl + request, {headers: myHeaders}) // https://cors-anywhere.herokuapp.com/https://example.com
    .then(response => response.json())
    .then(contents => {

        console.log(contents)       
        activeMarkerProps = {
            name: contents.name,
            url: contents.url,
            image: contents.image_url
        }
        
        if (this.state.activeMarker) {
        this.state.activeMarker.setAnimation(null);
        marker.setAnimation(this.props.google.maps.Animation.BOUNCE);
        this.setState({showingInfoWindow: true, activeMarker: marker, activeMarkerProps});
    
    } else {
marker.setAnimation(this.props.google.maps.Animation.BOUNCE);
this.setState({showingInfoWindow: true, activeMarker: marker, activeMarkerProps});
}})
    .catch(() => console.log("Can’t access " + request + " response. Blocked by browser?"))
      
        // Create props for the active marker
        
        activeMarkerProps = {
            name: "loading..",
            image: "image"
        }
    
                console.log(activeMarkerProps)

            if (this.state.activeMarker) {
            this.state.activeMarker.setAnimation(null);
            marker.setAnimation(this.props.google.maps.Animation.BOUNCE);
            this.setState({showingInfoWindow: true, activeMarker: marker, activeMarkerProps});
                        
                } else {
                    marker.setAnimation(this.props.google.maps.Animation.BOUNCE);
                    this.setState({showingInfoWindow: true, activeMarker: marker, activeMarkerProps});
                }
            }       
    

    updateMarkers = (locations) => {
        // If all the locations have been filtered then we're done
        if (!locations) 
            return;
        
        // For any existing markers remove them from the map
        this
            .state
            .markers
            .forEach(marker => marker.setMap(null));

        // Iterate over the locations to create parallel references to marker properties
        // and the markers themselves that can be used for reference in interactions.
        // Add the markers to the map along the way.
        let markerProps = [];
        let markers = locations.map((location, index) => {
            let mProps = {
                key: index,
                index,
                name: location.name,
                position: location.pos,
                url: location.url,
                yelp: location.yelp,
                image: location.image_url

            };
            markerProps.push(mProps);

            let animation = this.state.fisrtDrop ? this.props.google.maps.Animation.DROP : null;
            let marker = new this
                .props
                .google
                .maps
                .Marker({position: location.pos, map: this.state.map, animation});
            marker.addListener('click', () => {
                this.onMarkerClick(mProps, marker, null);
            });
            return marker;
        })

        this.setState({markers, markerProps});
    }

    render = () => {
        const style = {
            width: '100%',
            height: '100%'
        }
        const center = {
            lat: this.props.lat,
            lng: this.props.lon
        }
        let amProps = this.state.activeMarkerProps;

        return (
            <Map
                role="application"
                aria-label="map"
                onReady={this.mapReady}
                google={this.props.google}
                zoom={this.props.zoom}
                style={style}
                initialCenter={center}
                onClick={this.closeInfoWindow}>
                <InfoWindow
                    marker={this.state.activeMarker}
                    visible={this.state.showingInfoWindow}
                    onClose={this.closeInfoWindow}>
                    <div>
                        <h3>{amProps && amProps.name}</h3>
                        {amProps && amProps.url
                            ? (
                                <a href={amProps.url}>See website</a>
                            )
                            : ""}
                        {amProps && amProps.image
                            ? (
                                <div><img
                                    width="100px"
                                    height="100px"
                                    alt={amProps.name + " store picture"}
                                    src={amProps.image}/>
                                    <p>Image from Yelp</p>
                                </div>
                            )
                            : ""
                        }
                    </div>
                </InfoWindow>
            </Map>
        )
    }
}


export default GoogleApiWrapper({apiKey: MAP_KEY, LoadingContainer: NoMapDisplay})(MapDisplay)
