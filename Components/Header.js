import React, {useState} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  StyleSheet,
  Pressable,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';

// Header component
export default function Header({navigation, initials}) {
  return (
    <SafeAreaView>
      <View style={[styles.header]}>
        {/* Left: Navigation button */}
        <TouchableOpacity
          style={styles.navButton}
          onPress={() => navigation.toggleDrawer()}>
          <Text style={styles.navButtonText}>☰</Text>
        </TouchableOpacity>

        {/* Center: App Name */}
        <Text style={styles.title}>GlucoMind</Text>

        {/* Right: User initials circle */}
        <TouchableOpacity
          style={styles.userCircle}
          onPress={() => {
            navigation.navigate('Drawer', {screen: 'Logout'});
          }}>
          <Text style={styles.userInitials}>{initials}</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  header: {
    height: 56,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    justifyContent: 'space-between',
    flex: 1,
    width: '100%',
    borderBottomWidth: 0.5,
    borderBottomColor: '#007aff',
    borderBottomEndRadius: 100,
    borderBottomStartRadius: 100,
  },
  navButton: {
    padding: 8,
    zIndex: 10,
  },
  navButtonText: {
    fontSize: 35,
    color: '#007aff',
  },
  title: {
    color: '#007AFF',
    fontSize: 30,
    fontWeight: 'bold',
    position: 'absolute',
    left: 0,
    right: 0,
    textAlign: 'center',
    // To keep the title behind nav and user circle touches
  },
  userCircle: {
    backgroundColor: '#fff',
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#007aff',
    marginRight: 10,
  },
  userInitials: {
    color: '#007aff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'flex-start',
  },
  menu: {
    backgroundColor: 'white',
    paddingVertical: 8,
    marginTop: 56, // below header
    marginLeft: 12,
    borderRadius: 4,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.3,
    shadowRadius: 4,
    width: 200,
  },
  menuItem: {
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  menuItemText: {
    fontSize: 16,
    color: '#333',
  },
});
