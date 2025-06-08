import {StyleSheet} from 'react-native';
const styles = StyleSheet.create({
  container: {
    padding: 20,
    paddingBottom: 50,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
  },
  section: {
    marginBottom: 20,
  },
  heading: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 10,
  },
  text: {
    fontSize: 16,
    marginBottom: 6,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 20,
  },
  button: {
    padding: 14,
    borderRadius: 40,
    backgroundColor: '#eee',
  },
  liked: {
    backgroundColor: '#d4f8d4',
  },
  disliked: {
    backgroundColor: '#fddddd',
  },
  emoji: {
    fontSize: 24,
  },
  feedback: {
    textAlign: 'center',
    marginTop: 10,
    fontStyle: 'italic',
  },
});

export default styles;
