import React, {useState} from 'react';
import {
  ScrollView,
  StyleSheet,
  View,
  Text,
  Dimensions,
  TouchableOpacity,
  TextInput,
} from 'react-native';

const {width} = Dimensions.get('window');
const CARD_HEIGHT = 160;

export default function EmergencyContacts({ contacts, setContacts }) {
  const [editingIndex, setEditingIndex] = useState(null);

  const handleAddContact = () => {

    const newContact = {
      id: Date.now(),
      name: '',
      phone: '',
      email: '',
      isNew: true,
    };
    setContacts([newContact, ...contacts]);
    setEditingIndex(0); // first index is editable right away
  };

  const handleSave = index => {
    const updated = [...contacts];
    updated[index].isNew = false;
    setContacts(updated);
    setEditingIndex(null);
  };

  const handleEdit = index => {
    setEditingIndex(index);
  };

  const handleDelete = id => {
    setContacts(contacts.filter(c => c.id !== id));
    setEditingIndex(null);
  };

  const handleChange = (index, field, value) => {
    const updated = [...contacts];
    updated[index][field] = value;
    setContacts(updated);
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={{paddingTop: 80, paddingBottom: 120}}>
        {contacts.map((item, index) => {
          const isEditing = editingIndex === index;

          return (
            <View key={item.id.toString()} style={styles.card}>
              {isEditing ? (
                <>
                  <TextInput
                    placeholder="Name"
                    value={item.name}
                    onChangeText={text => handleChange(index, 'name', text)}
                    style={styles.input}
                  />
                  <TextInput
                    placeholder="Phone"
                    value={item.phone}
                    onChangeText={text => handleChange(index, 'phone', text)}
                    style={styles.input}
                    keyboardType="phone-pad"
                  />
                  <TextInput
                    placeholder="Email"
                    value={item.email}
                    onChangeText={text => handleChange(index, 'email', text)}
                    style={styles.input}
                    keyboardType="email-address"
                    autoCapitalize="none"
                  />
                  <TouchableOpacity
                    onPress={() => handleSave(index)}
                    style={styles.saveButton}>
                    <Text style={styles.saveText}>✅ Save</Text>
                  </TouchableOpacity>
                </>
              ) : (
                <>
                  <Text style={styles.name}>
                    {item.name || 'Unnamed Contact'}
                  </Text>
                  <Text style={styles.detail}>
                    📞 {item.phone || 'No phone'}
                  </Text>
                  <Text style={styles.detail}>
                    ✉️ {item.email || 'No email'}
                  </Text>
                  <View style={styles.actions}>
                    <TouchableOpacity onPress={() => handleEdit(index)}>
                      <Text style={styles.edit}>✏️ Edit</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => handleDelete(item.id)}>
                      <Text style={styles.delete}>🗑️ Delete</Text>
                    </TouchableOpacity>
                  </View>
                </>
              )}
            </View>
          );
        })}
      </ScrollView>

      <TouchableOpacity style={styles.addButton} onPress={handleAddContact}>
        <Text style={styles.addButtonText}>+ Add Emergency Contact</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f2f2f2',
  },
  card: {
    backgroundColor: '#fff',
    marginHorizontal: 20,
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    elevation: 3,
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  detail: {
    fontSize: 16,
    marginTop: 6,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 16,
  },
  edit: {
    marginRight: 20,
    color: '#007BFF',
    fontSize: 16,
  },
  delete: {
    color: '#FF3B30',
    fontSize: 16,
  },
  addButton: {
    position: 'absolute',
    bottom: 30,
    left: 20,
    right: 20,
    backgroundColor: '#007BFF',
    padding: 15,
    borderRadius: 12,
    alignItems: 'center',
  },
  addButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  input: {
    borderBottomWidth: 1,
    borderColor: '#ccc',
    fontSize: 16,
    paddingVertical: 8,
    marginBottom: 10,
  },
  saveButton: {
    marginTop: 10,
    alignSelf: 'flex-end',
  },
  saveText: {
    fontSize: 16,
    color: 'green',
  },
});
