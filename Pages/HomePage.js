// /* eslint-disable react-native/no-inline-styles */
// import React, {useState} from 'react';
// import {View, Text, TouchableOpacity, ScrollView, FlatList} from 'react-native';
// import {LineChart} from 'react-native-chart-kit';
// import Card from '../Components/HomePageCard';
// import Button from '../Components/HomePageButton';
// import {Menu, MenuItem} from 'react-native-material-menu';

// const HomePage = () => {
//   const [menuVisible, setMenuVisible] = useState(false);
//   const [graphType, setGraphType] = useState('day');

//   const glucoseValue = 145; // Example glucose level
//   const trend = 'rising'; // 'steady', 'falling', 'rising'
//   const initials = 'JD';

//   const getBorderColor = value => {
//     // interpolate between green (low) and red (high)
//     if (value < 100) return '#4CAF50'; // green
//     if (value < 140) return '#FFC107'; // yellow
//     return '#F44336'; // red
//   };

//   const renderTriangle = trend => {
//     const style = {
//       width: 0,
//       height: 0,
//       borderLeftWidth: 10,
//       borderRightWidth: 10,
//       borderBottomWidth: 15,
//       borderStyle: 'solid',
//       backgroundColor: 'transparent',
//       borderLeftColor: 'transparent',
//       borderRightColor: 'transparent',
//       borderBottomColor: '#333',
//       alignSelf: 'center',
//     };

//     if (trend === 'rising') style.transform = [{rotate: '-90deg'}];
//     else if (trend === 'falling') style.transform = [{rotate: '90deg'}];
//     else style.transform = [{rotate: '180deg'}];

//     return <View style={style} />;
//   };

//   return (
//     <ScrollView className="flex-1 bg-white p-4">
//       {/* Header */}
//       <View className="flex-row justify-between items-center mb-4">
//         <Menu
//           visible={menuVisible}
//           anchor={<Button onPress={() => setMenuVisible(true)}>☰</Button>}
//           onRequestClose={() => setMenuVisible(false)}>
//           {[
//             'Blood Glucose History',
//             'Recommend Meals',
//             'View Medications',
//             'Manage Account',
//             'Logout',
//           ].map(item => (
//             <MenuItem key={item} onPress={() => setMenuVisible(false)}>
//               {item}
//             </MenuItem>
//           ))}
//         </Menu>

//         <Text className="text-xl font-bold text-center flex-1">GlucoMind</Text>

//         <View className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
//           <Text className="text-white font-bold">{initials}</Text>
//         </View>
//       </View>

//       {/* Blood Glucose Monitoring Box */}
//       <View className="bg-gray-100 rounded-2xl p-4 mb-4 shadow">
//         <Text className="text-lg font-semibold mb-2">
//           Blood Glucose Monitoring
//         </Text>
//         <View className="flex-row items-center justify-center space-x-4">
//           {renderTriangle(trend)}
//           <View
//             style={{
//               width: 100,
//               height: 100,
//               borderRadius: 50,
//               borderWidth: 6,
//               borderColor: getBorderColor(glucoseValue),
//               justifyContent: 'center',
//               alignItems: 'center',
//             }}>
//             <Text className="text-lg font-bold">{glucoseValue} mg/dL</Text>
//           </View>
//         </View>

//         {/* Graph Switch */}
//         <View className="flex-row justify-center space-x-4 mt-4">
//           <Button
//             onPress={() => setGraphType('day')}
//             variant={graphType === 'day' ? 'default' : 'outline'}>
//             Day
//           </Button>
//           <Button
//             onPress={() => setGraphType('week')}
//             variant={graphType === 'week' ? 'default' : 'outline'}>
//             Week
//           </Button>
//         </View>

//         {/* Glucose Graph */}
//         <LineChart
//           data={{
//             labels:
//               graphType === 'day'
//                 ? ['6AM', '9AM', '12PM', '3PM', '6PM', '9PM']
//                 : ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
//             datasets: [
//               {
//                 data:
//                   graphType === 'day'
//                     ? [95, 105, 135, 130, 125, 110]
//                     : [120, 115, 140, 130, 125, 119],
//               },
//             ],
//           }}
//           width={320}
//           height={180}
//           chartConfig={{
//             backgroundGradientFrom: '#ffffff',
//             backgroundGradientTo: '#ffffff',
//             color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
//             strokeWidth: 2,
//           }}
//           style={{marginVertical: 8, borderRadius: 16}}
//         />
//       </View>

//       {/* Today's Meal Plan */}
//       <TouchableOpacity
//         className="bg-orange-100 rounded-2xl p-4 mb-4 shadow"
//         onPress={() => {
//           /* navigate to full meal plan */
//         }}>
//         <Text className="text-lg font-semibold mb-2">Today's Meal Plan</Text>
//         {[
//           {title: 'Breakfast', calories: 300, time: '15 min'},
//           {title: 'Lunch', calories: 500, time: '25 min'},
//           {title: 'Dinner', calories: 450, time: '20 min'},
//         ].map(meal => (
//           <Card key={meal.title} className="mb-2 p-2 bg-white">
//             <Text className="font-bold">{meal.title}</Text>
//             <Text>
//               {meal.calories} kcal · {meal.time}
//             </Text>
//           </Card>
//         ))}
//       </TouchableOpacity>

//       {/* Medication Box */}
//       <View className="bg-purple-100 rounded-2xl p-4 mb-8 shadow">
//         <Text className="text-lg font-semibold mb-2">Medications</Text>
//         {[
//           {name: 'Metformin', time: '8:00 AM'},
//           {name: 'Insulin', time: '6:00 PM'},
//         ].map((med, i) => (
//           <Card
//             key={i}
//             className="mb-2 p-2 bg-white flex-row justify-between items-center">
//             <View>
//               <Text className="font-bold">{med.name}</Text>
//               <Text className="text-sm">{med.time}</Text>
//             </View>
//             <TouchableOpacity className="w-6 h-6 border border-black rounded-sm" />
//           </Card>
//         ))}
//       </View>
//     </ScrollView>
//   );
// };

// export default HomePage;
