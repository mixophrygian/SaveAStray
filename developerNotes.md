applies to react-native stable version 0.18

Latest version of react-native requires some updating of AppDelegate.m:

1) In AppDelegate.m change:

RCTRootView *rootView = [[RCTRootView alloc] initWithBundleURL:jsCodeLocation
moduleName:@"yourAppName"
initialProperties:nil
launchOptions:launchOptions];

FROM

RCTRootView *rootView = [[RCTRootView alloc] initWithBundleURL:jsCodeLocation
moduleName:@"yourAppName"
launchOptions:launchOptions];

2) Within your tests folder (e.g. yourAppNameTests), comment out the line in
   the .m file:

redboxError = [[RCTRedBox sharedInstance] currentErrorMessage];

Then it should build with no errors.

//Thanks to rhaker on github for pointing this out in an issue thread of
//react-native: https://github.com/facebook/react-native/issues/2800

===

To make the NavigatorIOS work, go into
react-native/Libraries/Components/Navigation/NavigatorIOS.ios.js
comment out the line `navigationBarHidden: PropTypes.bool`

add to `type Route = {` a new route: `navigationBarHidden: boolean;`

prosper :)
