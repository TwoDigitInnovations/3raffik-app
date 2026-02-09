import { 
  Image, 
  KeyboardAvoidingView, 
  Platform, 
  ScrollView, 
  StyleSheet, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  View,
  Alert 
} from 'react-native'
import Constants, { FONTS } from '../../Assets/Helpers/constant'
import React, { useEffect, useState } from 'react'
import Header from '../../Assets/Component/Header'
import { goBack } from '../../../utils/navigationRef'
import { createProduct, getProductbyId, updateProduct } from '../../../redux/product/productAction'
import { useDispatch } from 'react-redux'
import { Calendar } from 'lucide-react-native'
import CameraGalleryPeacker from '../../Assets/Component/CameraGalleryPeacker'
import DateTimePickerModal from 'react-native-modal-datetime-picker'

const AddProduct = (props) => {
  const campaign_id = props?.route?.params?.campaign_id;
  const product_id = props?.route?.params?.product_id;
  const dispatch = useDispatch();
  const [submitted, setSubmitted] = useState(false);
  const [showImagePicker, setShowImagePicker] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [productVariants, setProductVariants] = useState([
    { unit: '', qty: '', offer_price: '', price: '' }
  ]);
  const [productModel, setProductModel] = useState({
    name: '',
    manufacturer_name: '',
    manufacturer_address: '',
    expiry_date: '',
    details: '',
    affiliate_commission: '',
    coustomer_discount: '',
  });

  useEffect(() => {
    if (product_id) {
      getproductbyid()
    }
  }, [])

  const getproductbyid = async () => {
    dispatch(getProductbyId(product_id))
      .unwrap()
      .then(data => {
        console.log('data', data);
        setProductModel({
          name: data.name || '',
          manufacturer_name: data.manufacturer_name || '',
          manufacturer_address: data.manufacturer_address || '',
          expiry_date: data.expiry_date || '',
          details: data.details || '',
          affiliate_commission: data.affiliate_commission || '',
          coustomer_discount: data.coustomer_discount || '',
        });
        // Set first variant from existing data
        if (data.unit || data.qty || data.offer_price || data.price) {
          setProductVariants([{
            unit: data.unit || '',
            qty: data.qty || '',
            offer_price: data.offer_price || '',
            price: data.price || ''
          }]);
        }
      })
      .catch(error => {
        console.error('getbyid failed:', error);
      });
  };

  const handleImageUpload = (type) => {
    setShowImagePicker(true);
  };

  const handleImageSelection = (imageData) => {
    console.log('Selected image:', imageData);
    setSelectedImage(imageData);
    // Store the image data in productModel
    setProductModel({...productModel, product_image: imageData});
  };

  const handleImagePickerCancel = () => {
    setShowImagePicker(false);
  };

  const addNewVariant = () => {
    setProductVariants([...productVariants, { unit: '', qty: '', offer_price: '', price: '' }]);
  };

  const removeVariant = (index) => {
    if (productVariants.length > 1) {
      const newVariants = productVariants.filter((_, i) => i !== index);
      setProductVariants(newVariants);
    }
  };

  const updateVariant = (index, field, value) => {
    const newVariants = [...productVariants];
    newVariants[index][field] = value;
    setProductVariants(newVariants);
  };

  const handleDateConfirm = (date) => {
    // Format date as MM/DD/YY
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const year = String(date.getFullYear()).slice(-2);
    const formattedDate = `${month}/${day}/${year}`;
    
    setProductModel({...productModel, expiry_date: formattedDate});
    setShowDatePicker(false);
  };

  const handleDateCancel = () => {
    setShowDatePicker(false);
  };

  const submit = async () => {
    console.log('Submit button clicked');
    console.log('Product Model:', productModel);
    console.log('Product Variants:', productVariants);
    
    // Validate at least one variant has price
    const hasValidVariant = productVariants.some(v => v.price);
    
    if (!productModel?.name || 
        !productModel?.manufacturer_name || !hasValidVariant || 
        !productModel?.affiliate_commission || !productModel?.coustomer_discount) {
      console.log('Validation failed - missing required fields');
      setSubmitted(true)
      return;
    }
    
    console.log('Validation passed, proceeding with Redux API call');
    
    try {
      // For now, we'll use the first variant's data
      // In future, you can modify backend to support multiple variants
      const firstVariant = productVariants[0];
      
      let dataToSend;
      
      if (selectedImage) {
        // Create FormData for image upload
        const formData = new FormData();
        
        // Add all text fields
        formData.append('name', productModel.name);
        formData.append('manufacturer_name', productModel.manufacturer_name);
        formData.append('manufacturer_address', productModel.manufacturer_address || '');
        formData.append('expiry_date', productModel.expiry_date || '');
        formData.append('details', productModel.details || '');
        formData.append('unit', firstVariant.unit || '');
        formData.append('qty', firstVariant.qty || '');
        formData.append('offer_price', firstVariant.offer_price || '');
        formData.append('price', firstVariant.price);
        formData.append('affiliate_commission', productModel.affiliate_commission);
        formData.append('coustomer_discount', productModel.coustomer_discount);
        
        if (campaign_id) {
          formData.append('campaign', campaign_id);
        }
        if (product_id) {
          formData.append('id', product_id);
        }
        
        // Add image
        formData.append('product_image', {
          uri: selectedImage.uri,
          type: selectedImage.type,
          name: selectedImage.name || 'product_image.jpg'
        });
        
        dataToSend = formData;
        console.log('Using FormData with Redux action');
      } else {
        // Regular JSON data
        const cleanProductModel = {
          name: productModel.name,
          manufacturer_name: productModel.manufacturer_name,
          manufacturer_address: productModel.manufacturer_address || '',
          expiry_date: productModel.expiry_date || '',
          details: productModel.details || '',
          unit: firstVariant.unit || '',
          qty: firstVariant.qty || '',
          offer_price: firstVariant.offer_price || '',
          price: firstVariant.price,
          affiliate_commission: productModel.affiliate_commission,
          coustomer_discount: productModel.coustomer_discount,
        };
        
        if (campaign_id) {
          cleanProductModel.campaign = campaign_id;
        }
        if (product_id) {
          cleanProductModel.id = product_id;
        }
        
        dataToSend = cleanProductModel;
        console.log('Using JSON data with Redux action');
      }

      // Use Redux action for both cases
      const result = await dispatch(
        product_id ? updateProduct(dataToSend) : createProduct(dataToSend)
      ).unwrap();
      
      console.log('Redux API Success:', result);
      resetForm();
      goBack();
      
    } catch (error) {
      console.error('Redux API Error:', error);
      Alert.alert('Error', typeof error === 'string' ? error : 'Failed to create product');
    }
  };

  const resetForm = () => {
    setProductModel({
      name: '',
      manufacturer_name: '',
      manufacturer_address: '',
      expiry_date: '',
      details: '',
      affiliate_commission: '',
      coustomer_discount: '',
    });
    setProductVariants([{ unit: '', qty: '', offer_price: '', price: '' }]);
    setSelectedImage(null);
    setSubmitted(false);
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <Header item={"Add Product"} showback={true} />
      </View>
      
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}>
        <ScrollView 
          showsVerticalScrollIndicator={false}
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}>
          
          {/* Product Name */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Product Name</Text>
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.textInput}
                placeholder="Product Name"
                placeholderTextColor={Constants.customgrey2}
                value={productModel?.name}
                onChangeText={name => setProductModel({...productModel, name})}
              />
            </View>
            {submitted && !productModel?.name && (
              <Text style={styles.errorText}>Product name is required</Text>
            )}
          </View>

          {/* Upload Product Photo */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Upload Product Photo</Text>
            <TouchableOpacity 
              style={styles.uploadImageContainer}
              onPress={() => handleImageUpload('photo')}>
              {selectedImage ? (
                <Image 
                  source={{ uri: selectedImage.uri }} 
                  style={styles.selectedImage}
                  resizeMode="cover"
                />
              ) : (
                <Image 
                  source={require('../../Assets/Images/imgupload.png')} 
                  style={styles.uploadImageOnly}
                  resizeMode="contain"
                />
              )}
            </TouchableOpacity>
          </View>

          {/* Manufacturer Name */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Manufacturer Name</Text>
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.textInput}
                placeholder="Enter manufacturer name"
                placeholderTextColor={Constants.customgrey2}
                value={productModel?.manufacturer_name}
                onChangeText={manufacturer_name => setProductModel({...productModel, manufacturer_name})}
              />
            </View>
            {submitted && !productModel?.manufacturer_name && (
              <Text style={styles.errorText}>Manufacturer name is required</Text>
            )}
          </View>

          {/* Manufacturer Address */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Manufacturer Address</Text>
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.textInput}
                placeholder="Enter manufacturer address"
                placeholderTextColor={Constants.customgrey2}
                value={productModel?.manufacturer_address}
                onChangeText={manufacturer_address => setProductModel({...productModel, manufacturer_address})}
              />
            </View>
          </View>

          {/* Expiry Date */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Expiry Date</Text>
            <TouchableOpacity 
              style={styles.inputContainer}
              onPress={() => setShowDatePicker(true)}>
              <Text style={[
                styles.dateText,
                !productModel?.expiry_date && styles.placeholderText
              ]}>
                {productModel?.expiry_date || 'MM/DD/YY'}
              </Text>
              <Calendar size={20} color={Constants.customgrey2} style={styles.calendarIcon} />
            </TouchableOpacity>
          </View>

          {/* Details */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Details</Text>
            <View style={[styles.inputContainer, styles.textAreaContainer]}>
              <TextInput
                style={[styles.textInput, styles.textArea]}
                placeholder="Long Description"
                placeholderTextColor={Constants.customgrey2}
                multiline={true}
                numberOfLines={4}
                value={productModel?.details}
                onChangeText={details => setProductModel({...productModel, details})}
              />
            </View>
          </View>

          {/* Affiliate Commission */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Affiliate Commission</Text>
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.textInput}
                placeholder="Enter affiliate commission"
                placeholderTextColor={Constants.customgrey2}
                keyboardType="numeric"
                value={productModel?.affiliate_commission}
                onChangeText={affiliate_commission => setProductModel({...productModel, affiliate_commission})}
              />
            </View>
            {submitted && !productModel?.affiliate_commission && (
              <Text style={styles.errorText}>Affiliate commission is required</Text>
            )}
          </View>

          {/* Customer Discount */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Customer Discount</Text>
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.textInput}
                placeholder="Enter customer discount"
                placeholderTextColor={Constants.customgrey2}
                keyboardType="numeric"
                value={productModel?.coustomer_discount}
                onChangeText={coustomer_discount => setProductModel({...productModel, coustomer_discount})}
              />
            </View>
            {submitted && !productModel?.coustomer_discount && (
              <Text style={styles.errorText}>Customer discount is required</Text>
            )}
          </View>

          {/* Add More Button */}
          <TouchableOpacity 
            style={styles.addMoreButton}
            onPress={addNewVariant}>
            <Text style={styles.addMoreText}>Add More</Text>
          </TouchableOpacity>

          {/* Product Variants */}
          {productVariants.map((variant, index) => (
            <View key={index} style={styles.additionalFieldsContainer}>
              {/* Variant Header */}
              <View style={styles.variantHeader}>
                <Text style={styles.variantTitle}>Variant {index + 1}</Text>
                {productVariants.length > 1 && (
                  <TouchableOpacity 
                    style={styles.closeButton}
                    onPress={() => removeVariant(index)}>
                    <Text style={styles.closeButtonText}>✕</Text>
                  </TouchableOpacity>
                )}
              </View>

              {/* Unit */}
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Unit</Text>
                <View style={styles.inputContainer}>
                  <TextInput
                    style={styles.textInput}
                    placeholder="Select Unit"
                    placeholderTextColor={Constants.customgrey2}
                    value={variant.unit}
                    onChangeText={(value) => updateVariant(index, 'unit', value)}
                  />
                </View>
              </View>

              {/* Qty */}
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Qty</Text>
                <View style={styles.inputContainer}>
                  <TextInput
                    style={styles.textInput}
                    placeholder="Enter Qty"
                    placeholderTextColor={Constants.customgrey2}
                    keyboardType="numeric"
                    value={variant.qty}
                    onChangeText={(value) => updateVariant(index, 'qty', value)}
                  />
                </View>
              </View>

              {/* Offer Price */}
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Offer Price</Text>
                <View style={styles.inputContainer}>
                  <TextInput
                    style={styles.textInput}
                    placeholder="Enter Discounted Price"
                    placeholderTextColor={Constants.customgrey2}
                    keyboardType="numeric"
                    value={variant.offer_price}
                    onChangeText={(value) => updateVariant(index, 'offer_price', value)}
                  />
                </View>
              </View>

              {/* Price */}
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Price</Text>
                <View style={styles.inputContainer}>
                  <TextInput
                    style={styles.textInput}
                    placeholder="Enter Price"
                    placeholderTextColor={Constants.customgrey2}
                    keyboardType="numeric"
                    value={variant.price}
                    onChangeText={(value) => updateVariant(index, 'price', value)}
                  />
                </View>
                {submitted && !variant.price && index === 0 && (
                  <Text style={styles.errorText}>At least one variant price is required</Text>
                )}
              </View>
            </View>
          ))}

          {/* Create Button */}
          <TouchableOpacity 
            style={styles.createButton} 
            onPress={() => {
              console.log('Create button pressed!');
              submit();
            }}>
            <Text style={styles.createButtonText}>
              {product_id ? "Update" : "Create"}
            </Text>
          </TouchableOpacity>

        </ScrollView>
      </KeyboardAvoidingView>

      {/* Camera Gallery Picker Modal */}
      <CameraGalleryPeacker
        show={showImagePicker}
        title="Upload Product Photo"
        getImageValue={handleImageSelection}
        cancel={handleImagePickerCancel}
        width={300}
        height={300}
        quality={0.8}
        base64={false}
      />

      {/* Date Picker Modal */}
      <DateTimePickerModal
        isVisible={showDatePicker}
        mode="date"
        onConfirm={handleDateConfirm}
        onCancel={handleDateCancel}
        minimumDate={new Date()}
        date={new Date()}
      />
    </View>
  )
}

export default AddProduct

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Constants.white,
  },
  headerContainer: {
    backgroundColor: '#FFCC00',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 15,
  },
  keyboardView: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 30,
  },
  inputGroup: {
    marginHorizontal: 20,
    marginTop: 20,
  },
  label: {
    fontSize: 16,
    color: Constants.black,
    fontFamily: FONTS.Medium,
    marginBottom: 8,
  },
  inputContainer: {
    height: 50,
    borderWidth: 1,
    borderColor: '#E5E5E5',
    borderRadius: 8,
    backgroundColor: '#F9F7ED',
    paddingHorizontal: 15,
    flexDirection: 'row',
    alignItems: 'center',
  },
  textInput: {
    flex: 1,
    fontSize: 14,
    color: Constants.black,
    fontFamily: FONTS.Regular,
  },
  textAreaContainer: {
    height: 100,
    alignItems: 'flex-start',
    paddingVertical: 12,
  },
  textArea: {
    textAlignVertical: 'top',
  },
  uploadImageContainer: {
    alignSelf: 'flex-start',
    marginBottom: 10,
  },
  uploadImageOnly: {
    width: 80,
    height: 80,
  },
  selectedImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
  },
  calendarIcon: {
    marginLeft: 10,
  },
  dateText: {
    flex: 1,
    fontSize: 14,
    color: Constants.black,
    fontFamily: FONTS.Regular,
  },
  placeholderText: {
    color: Constants.customgrey2,
  },
  addMoreButton: {
    backgroundColor: '#FFCC00',
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 20,
    alignSelf: 'flex-end',
    marginHorizontal: 20,
    marginTop: 15,
  },
  addMoreText: {
    fontSize: 14,
    color: Constants.black,
    fontFamily: FONTS.Medium,
  },
  additionalFieldsContainer: {
    backgroundColor: 'white',
    borderRadius: 8,
    marginHorizontal: 20,
    marginTop: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: '#E5E5E5',
    position: 'relative',
  },
  variantHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  variantTitle: {
    fontSize: 16,
    color: Constants.black,
    fontFamily: FONTS.SemiBold,
  },
  closeButton: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#F0F0F0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButtonText: {
    fontSize: 16,
    color: Constants.black,
    fontFamily: FONTS.Medium,
  },
  createButton: {
    backgroundColor: '#FFCC00',
    borderRadius: 25,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 20,
    marginTop: 30,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  createButtonText: {
    fontSize: 16,
    color: Constants.black,
    fontFamily: FONTS.SemiBold,
  },
  errorText: {
    color: Constants.red,
    fontFamily: FONTS.Regular,
    fontSize: 12,
    marginTop: 5,
  },
})