'use strict';

import React from 'react-native';
import SingleResult from './SingleResult';

const {
    StyleSheet,
    Image,
    View,
    TouchableHighlight,
    ListView,
    Text,
    Component
} = React;

const styles = StyleSheet.create({
    thumb: {
        width: 90,
        height: 90,
        marginRight: 10,
        backgroundColor: 'gray'
    },
    textContainer: {
        flex: 1
    },
    stars: {
        width: 84,
        height: 17,
        paddingLeft: 3
    },
    separator: {
        height: 1,
        backgroundColor: '#dddddd'
    },
    header: {
        fontSize: 18,
        fontFamily: 'Open Sans',
        fontWeight: 'bold',
        color: 'black'
    },
    area: {
        fontSize: 14,
        fontFamily: 'Open Sans',
        color: '#656565'
    },
    reviewCount: {
        fontSize: 10,
        fontFamily: 'Open Sans',
        marginBottom: 4,
        color: '#656565'
    },
    rowContainer: {
        flexDirection: 'row',
        flex: 1,
        padding: 13,
        backgroundColor: 'white',
    },
    fatSeparator: {
        height: 14,
        backgroundColor: '#F7F7F7'
    }
});

class SearchResults extends Component {

    constructor(props) {
        super(props);
        let dataSource = new ListView.DataSource(
            {rowHasChanged: (r1, r2) => r1.id !== r2.id });
        this.state = {
            dataSource: dataSource.cloneWithRows(this.props.results)
        };
    }

    rowPressed(property) {
        const result = this.props.results.filter(prop => prop.id === property.id);

        this.props.navigator.push({
            title: '',
            component: SingleResult,
            passProps: {result: result}
        });
    }

    renderRow(rowData, sectionID, rowID) {
        const name = rowData.name;
        const reviewCount = rowData.review_count;
        const reviews = reviewCount + (reviewCount > 1 ? ' reviews' : ' review');
        const rating = rowData.rating;
        const number = rowData.phone;
        let area = (rowData.location.neighborhoods || rowData.location.city);
        area += ', ' + rowData.location.state_code;
        const tempImage = require('./../images/catnose.jpg');
        const picture = rowData.image_url ? { uri: rowData.image_url } : tempImage;

        return (
            <TouchableHighlight 
                onPress={() => this.rowPressed(rowData)}
                underlayColor='#dddddd'>
            <View>
                <View style={styles.rowContainer}>
                    <Image style={styles.thumb} defaultSource={{tempImage}} source={picture} />
                    <View style={styles.textContainer}>
                        <Text style={styles.header}>{name}</Text>
                        <Text style={styles.area}>{area}</Text>
                        <Text style={styles.reviewCount}
                            numberOfLines={1}>{reviews}
                        </Text>
                        <Image style={styles.stars} source={{ uri: rowData.rating_img_url }} />
                    </View>
                </View>
            </View>
            </TouchableHighlight>
        );
    }

    render() {
        return (
            <ListView
                dataSource={this.state.dataSource}
                renderRow={this.renderRow.bind(this)}
                renderSeparator={(sectionID, rowID) => <View key={`${sectionID}-${rowID}`} style={styles.fatSeparator} />}
                />

        );
    }
}

module.exports = SearchResults;

