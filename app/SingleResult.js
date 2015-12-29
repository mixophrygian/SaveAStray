'use strict';

var React = require('react-native');

var { 
    StyleSheet,
    Image,
    View,
    Text,
    Component
} = React;

var styles = StyleSheet.create({
    container: {
        marginTop: 65
    },
    heading: {
        backgroundColor: '#F8F8F8',
    },
    separator: {
        height: 1,
        backgroundColor: '#DDDDDD'
    },
    image: {
        width: 110,
        height: 110
    },
    name: {
        fontSize: 25,
        fontWeight: 'bold',
        margin: 5,
        color: '#48BBEC'
    },
    title: {
        fontSize: 20,
        margin: 5,
        color: '#656565'
    },
    description: {
        fontSize: 18,
        margin: 5,
        color: '#656565'
    }
});

class SingleResult extends Component {
    render() {
        console.log(this.props.result);
        var result = this.props.result[0];
        var details = result.review_count + ' ' + result.rating;
        var name = result.name;
        var phone = result.phone;
        var image = result.image_url;

        return (
            <View style={styles.container}>
                <Image style={styles.image}
                        source={{uri: image }} />
                <View style={styles.heading}>
                    <Text style={styles.name}>{name}</Text>
                    <Text style={styles.title}>{phone}</Text>
                    <View style={styles.separator}/>
                </View>
                <Text style={styles.description}>{details}</Text>
                <Text style={styles.description}>blah blah blah</Text>
            </View>
        );
    }            
}

module.exports = SingleResult;
