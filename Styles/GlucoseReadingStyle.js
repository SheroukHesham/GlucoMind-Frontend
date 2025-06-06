import {StyleSheet} from 'react-native';
const styles = StyleSheet.create({
  container: {
    backgroundColor: '#F3F4F6', // gray-100
    borderRadius: 20, // rounded-2xl
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 20,
    color: '#111827', // dark text
    textAlign: 'center',
  },
  contentRow: {
    flexDirection: 'row',
    alignItems: 'right',
    justifyContent: 'center',
    gap: 10, // React Native doesn't support gap, use margin instead
    marginBottom: 5,
    marginTop: 5,
  },
  glucoseCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 6,
    justifyContent: 'center',
    alignItems: 'center',
  },
  glucoseText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
  },
  unitText: {
    fontSize: 14,
    color: '#111827',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 16,
  },
  statBox: {
    alignItems: 'center',
    flex: 1,
  },
  statLabel: {
    fontSize: 14,
    color: '#6B7280', // gray-500
  },
  statValue: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
    marginTop: 4,
  },
});

export default styles;
