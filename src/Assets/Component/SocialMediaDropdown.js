import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  FlatList,
  StyleSheet,
} from 'react-native';
import { Facebook, Instagram, Twitter, Linkedin, ChevronDown, Check } from 'lucide-react-native';
import Constants, { FONTS } from '../Helpers/constant';

const SocialMediaDropdown = ({ 
  selectedPlatforms, 
  onSelectionChange, 
  placeholder = "Select Social Media Platforms",
  editable = true 
}) => {
  const [isVisible, setIsVisible] = useState(false);
  
  const socialMediaOptions = [
    { id: 'facebook', name: 'Facebook', IconComponent: Facebook, color: '#1877F2' },
    { id: 'instagram', name: 'Instagram', IconComponent: Instagram, color: '#E4405F' },
    { id: 'twitter', name: 'X (Twitter)', IconComponent: Twitter, color: '#000000' },
    { id: 'linkedin', name: 'LinkedIn', IconComponent: Linkedin, color: '#0A66C2' },
  ];

  const togglePlatform = (platformId) => {
    const updatedSelection = selectedPlatforms.includes(platformId)
      ? selectedPlatforms.filter(id => id !== platformId)
      : [...selectedPlatforms, platformId];
    
    onSelectionChange(updatedSelection);
  };

  const getDisplayText = () => {
    if (selectedPlatforms.length === 0) return placeholder;
    if (selectedPlatforms.length === 1) {
      const platform = socialMediaOptions.find(p => p.id === selectedPlatforms[0]);
      return platform?.name || '';
    }
    return `${selectedPlatforms.length} platforms selected`;
  };

  const renderOption = ({ item }) => {
    const { IconComponent } = item;
    return (
      <TouchableOpacity
        style={[
          styles.optionItem,
          selectedPlatforms.includes(item.id) && styles.selectedOption
        ]}
        onPress={() => togglePlatform(item.id)}
      >
        <View style={styles.iconContainer}>
          <IconComponent 
            size={20} 
            color={selectedPlatforms.includes(item.id) ? Constants.black : item.color}
          />
        </View>
        <Text style={[
          styles.optionText,
          selectedPlatforms.includes(item.id) && styles.selectedOptionText
        ]}>
          {item.name}
        </Text>
        {selectedPlatforms.includes(item.id) && (
          <Check size={16} color={Constants.black} />
        )}
      </TouchableOpacity>
    );
  };

  return (
    <View>
      <TouchableOpacity
        style={[styles.dropdown, !editable && styles.disabledDropdown]}
        onPress={() => editable && setIsVisible(true)}
        disabled={!editable}
      >
        <Text style={[
          styles.dropdownText,
          selectedPlatforms.length === 0 && styles.placeholderText
        ]}>
          {getDisplayText()}
        </Text>
        <ChevronDown size={16} color={Constants.customgrey2} />
      </TouchableOpacity>

      <Modal
        visible={isVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setIsVisible(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setIsVisible(false)}
        >
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Select Social Media Platforms</Text>
            <FlatList
              data={socialMediaOptions}
              renderItem={renderOption}
              keyExtractor={(item) => item.id}
              style={styles.optionsList}
            />
            <TouchableOpacity
              style={styles.doneButton}
              onPress={() => setIsVisible(false)}
            >
              <Text style={styles.doneButtonText}>Done</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  dropdown: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderRadius: 25,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    height: 55,
    paddingHorizontal: 20,
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.1)',
    marginBottom: 18,
  },
  disabledDropdown: {
    backgroundColor: 'rgba(240, 240, 240, 0.9)',
  },
  dropdownText: {
    color: Constants.black,
    fontSize: 14,
    fontFamily: FONTS.Medium,
    flex: 1,
  },
  placeholderText: {
    color: Constants.customgrey2,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 20,
    width: '80%',
    maxHeight: '60%',
  },
  modalTitle: {
    fontSize: 18,
    fontFamily: FONTS.SemiBold,
    color: Constants.black,
    textAlign: 'center',
    marginBottom: 20,
  },
  optionsList: {
    maxHeight: 200,
  },
  optionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal: 10,
    borderRadius: 10,
    marginBottom: 5,
  },
  selectedOption: {
    backgroundColor: Constants.custom_yellow,
  },
  iconContainer: {
    marginRight: 15,
    width: 20,
    alignItems: 'center',
  },
  optionText: {
    fontSize: 16,
    fontFamily: FONTS.Medium,
    color: Constants.black,
    flex: 1,
  },
  selectedOptionText: {
    fontFamily: FONTS.SemiBold,
  },
  doneButton: {
    backgroundColor: Constants.custom_yellow,
    borderRadius: 25,
    paddingVertical: 12,
    alignItems: 'center',
    marginTop: 15,
  },
  doneButtonText: {
    color: Constants.black,
    fontSize: 16,
    fontFamily: FONTS.SemiBold,
  },
});

export default SocialMediaDropdown;