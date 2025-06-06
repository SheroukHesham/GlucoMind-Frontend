import {StyleSheet} from 'react-native';

const styles = StyleSheet.create({
  container: {padding: 20, paddingTop: 40},
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 10,
    marginBottom: 10,
  },
  bubble: {
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#007AFF',
    marginRight: 10,
  },
  // bubbleSelected: {
  //   backgroundColor: '#157eee',
  // },
  bubbleText: {
    color: '#007AFF',
  },
  // bubbleTextSelected: {
  //   color: '#fff',
  // },
  registerButton: {
    backgroundColor: '#28a745',
    padding: 15,
    marginTop: 30,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 100,
  },
  registerText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  plusIcon: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#007AFF',
    marginRight: 10,
  },
  addField: {color: '#007AFF', fontWeight: 'bold'},
  addContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 20,
  },

errorText: {
  color: 'red',
  fontSize: 12,
  marginTop: 4,
  marginBottom: 8,
},

sectionTitle: {
  fontSize: 18,
  fontWeight: 'bold',
  marginVertical: 12,
},

registerButton: {
  padding: 15,
  borderRadius: 8,
  alignItems: 'center',
  marginVertical: 60,
},

registerText: {
  color: 'white',
  fontWeight: 'bold',
  fontSize: 16,
},

input: {
  borderWidth: 1,
  borderColor: '#ccc',
  padding: 10,
  borderRadius: 6,
  marginBottom: 12,
},

inputLabel: {
  marginLeft: 5,
  fontSize: 14,
  color: '#555',
  marginBottom: 4,
},


manualTimeRow: {
  flexDirection: 'row',
  alignItems: 'center',
  flexWrap: 'wrap',
  marginBottom: 10,
},
timeInput: {
  borderWidth: 1,
  borderColor: '#ccc',
  padding: 6,
  borderRadius: 6,
  width: 50,
  marginHorizontal: 5,
  textAlign: 'center',
},
timePickerContainer: {
  backgroundColor: '#f3f3f3',
  padding: 10,
  marginTop: 8,
  borderRadius: 8,
},
frequencyRow: {
  flexDirection: 'row',
  marginBottom: 10,
},
freqButton: {
  paddingVertical: 6,
  paddingHorizontal: 12,
  backgroundColor: '#ddd',
  marginRight: 8,
  borderRadius: 6,
},
freqButtonSelected: {
  backgroundColor: '#1976d2',
},
saveTimeBtn: {
  backgroundColor: '#1976d2',
  paddingVertical: 8,
  alignItems: 'center',
  borderRadius: 6,
},

setTimeButton: {
  backgroundColor: '#e0e0e0',
  paddingVertical: 10,
  paddingHorizontal: 12,
  borderRadius: 6,
  marginBottom: 10,
},
setTimeButtonText: {
  color: '#333',
  fontSize: 14,
},


});

export default styles;
