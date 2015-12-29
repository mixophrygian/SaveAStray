'use strict';

var React = require('react-native');
var SingleResult = require('./SingleResult');

var {
    StyleSheet,
    Image,
    View,
    TouchableHighlight,
    ListView,
    Text,
    Component
} = React;

var styles = StyleSheet.create({
    thumb: {
        width: 90,
        height: 90,
        marginRight: 10
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
        fontSize: 20,
        fontWeight: 'bold',
        color: '#555555'
    },
    area: {
        fontSize: 20,
        marginTop: 3,
        marginBottom: 3,
        color: '#656565'
    },
    reviewCount: {
        fontSize: 18,
        marginBottom: 2,
        color: '#656565'
    },
    rowContainer: {
        flexDirection: 'row',
        padding: 10,
        backgroundColor: 'white'
    }
});

class SearchResults extends Component {

    constructor(props) {
        super(props);
        var dataSource = new ListView.DataSource(
            {rowHasChanged: (r1, r2) => r1.id !== r2.id });
        this.state = {
            dataSource: dataSource.cloneWithRows(this.props.results)
        };
    }

    rowPressed(property) {
        var result = this.props.results.filter(prop => prop.id === property.id);

        this.props.navigator.push({
            title: '',
            component: SingleResult,
            passProps: {result: result}
        });
    }

    renderRow(rowData, sectionID, rowID) {
        var name = rowData.name;
        var reviewCount = rowData.review_count;
        var reviews = reviewCount + (reviewCount > 1 ? ' reviews' : ' review');
        var rating = rowData.rating;
        var number = rowData.phone;
        var area = (rowData.location.neighborhoods || rowData.location.city);
        //TODO: add alternate place-holder picture when none is available
        var picture = ( rowData.image_url || '');

        return (
            <TouchableHighlight 
                onPress={() => this.rowPressed(rowData)}
                underlayColor='#dddddd'>
            <View>
                <View style={styles.rowContainer}>
                    <Image style={styles.thumb} source={{ uri: picture }} />
                    <View style={styles.textContainer}>
                        <Text style={styles.header}>{name}</Text>
                        <Text style={styles.area}>{area}</Text>
                        <Text style={styles.reviewCount}
                            numberOfLines={1}>{reviews}
                        </Text>
                        <Image style={styles.stars} source={{ uri: rowData.rating_img_url }} />
                    </View>
                </View>
                <View style={styles.separator}/>
            </View>
            </TouchableHighlight>
        );
    }

    render() {
        return (
            <ListView
                dataSource={this.state.dataSource}
                renderRow={this.renderRow.bind(this)}/>
        );
    }
}

module.exports = SearchResults;

