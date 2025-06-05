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
  bubbleSelected: {
    backgroundColor: '#157eee',
  },
  bubbleText: {
    color: '#007AFF',
  },
  bubbleTextSelected: {
    color: '#fff',
  },
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
});

export default styles;
