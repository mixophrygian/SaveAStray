'use strict';

var React = require('react-native');

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
        width: 80,
        height: 80,
        marginRight: 10
    },
    textContainer: {
        flex: 1
    },
    separator: {
        height: 1,
        backgroundColor: '#dddddd'
    },
    number: {
        fontSize: 25,
        fontWeight: 'bold',
        color: '#48BBEC'
    },
    title: {
        fontSize: 20,
        color: '#656565'
    },
    rowContainer: {
        flexDirection: 'row',
        padding: 10
    }
});

class SearchResults extends Component {

    constructor(props) {
        super(props);
        var dataSource = new ListView.DataSource(
            {rowHasChanged: (r1, r2) => r1 !== r2 });
        this.state = {
            dataSource: dataSource.cloneWithRows(this.props.results)
        };
    }

    rowPressed(property) {
        var property = this.props.results.filter(prop => prop === property);
    }

    renderRow(rowData, sectionID, rowID) {
        var number = rowData.phone;
        return (
            <TouchableHighlight 
                onPress={() => this.rowPressed(rowData)}
                underlayColor='#dddddd'>
            <View>
                <View style={styles.rowContainer}>
                    <Image style={styles.thumb} source={{ uri: rowData.image_url }} />
                    <View style={styles.textContainer}>
                        <Text style={styles.number}>{number}</Text>
                        <Text style={styles.title}
                            numberOfLines={1}>{rowData.name}</Text>
                    </View>
                </View>
                <View style={styles.separator}/>
            </View>
            </TouchableHighlight>
        );
    }

    render() {
        console.log(this.state.dataSource)
        return (
            <ListView
                dataSource={this.state.dataSource}
                renderRow={this.renderRow.bind(this)}/>
        );
    }
}

module.exports = SearchResults;

