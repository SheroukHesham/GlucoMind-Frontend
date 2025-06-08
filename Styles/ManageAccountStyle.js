import {StyleSheet} from 'react-native';
const styles = StyleSheet.create({
  container: {
    padding: 20,
    paddingBottom: 50,
  },
  header: {
    fontSize: 24,
    fontWeight: '600',
    marginBottom: 20,
    textAlign: 'center',
  },
  label: {
    fontWeight: '500',
    marginBottom: 6,
    marginTop: 16,
    fontSize: 18,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    padding: 10,
    fontSize: 16,
    backgroundColor: '#fff',
  },
  button: {
    backgroundColor: '#007AFF',
    padding: 14,
    borderRadius: 10,
    marginTop: 30,
  },
  buttonText: {
    color: '#fff',
    textAlign: 'center',
    fontSize: 18,
    fontWeight: '600',
  },
  disabledInput: {
    backgroundColor: '#f0f0f0',
    color: '#666',
  },
  bubbleContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginTop: 10,
  },
  bubble: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#007aff',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginRight: 8,
    marginBottom: 10,
  },
  bubbleText: {
    fontSize: 16,
    color: '#fff',
    paddingHorizontal: 5,
    textAlign: 'center',
    marginRight: 5,
    verticalAlign: 'middle',
  },
  removeText: {
    color: '#ff0000',
    fontSize: 16,
    fontWeight: 'bold',
    textAlignVertical: 'center',
    paddingLeft: 6,
    verticalAlign: 'middle',
  },
  addMealRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  },
  addButtonSmall: {
    marginLeft: 10,
    backgroundColor: '#007AFF',
    padding: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  addButtonTextSmall: {
    color: '#fff',
    fontSize: 25,
  },
});

export default styles;
