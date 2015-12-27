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

class SearchResults extends Component {

    constructor(props) {
        super(props);
        var dataSource = new ListView.DataSource(
            {rowHasChanged: (r1, r2) => r1 !== r2 });
        this.state = {
            dataSource: dataSource.cloneWithRows(this.props.results)
        };
    }

    renderRow(rowData, sectionID, rowID) {
        return (
            <TouchableHighlight
                underlayColor='#dddddd'>
            <View>
                <Text>{rowData}</Text>
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

