import React, { useState } from 'react';
import { StyleSheet, Text, View, ScrollView, Image, TouchableOpacity, TextInput, Dimensions, SafeAreaView, StatusBar } from 'react-native';

const { width } = Dimensions.get('window');

// Premium Color Palette
const COLORS = {
  gold: '#C5A880',
  darkGold: '#A38760',
  charcoal: '#1A1A1A',
  cream: '#FAF9F6',
  white: '#FFFFFF',
  neutral: '#E5E5E5',
  gray: '#8E8E93',
  lightGray: '#F2F2F7',
};

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<'splash' | 'onboarding' | 'auth' | 'home' | 'details' | 'cart' | 'checkout' | 'profile'>('splash');
  
  // Mock Active Product for Details View
  const [activeProduct, setActiveProduct] = useState({
    name: 'Cashmere Trench Coat',
    price: '$249.00',
    brand: 'Zara',
    description: 'Structured double-breasted coat crafted from cashmere wool blend. Features classic lapel, belt closure, and satin lining.',
    image: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=600&q=80',
    sizes: ['XS', 'S', 'M', 'L'],
    colors: ['Beige', 'Camel', 'Black'],
  });

  const [selectedSize, setSelectedSize] = useState('M');
  const [selectedColor, setSelectedColor] = useState('Beige');

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.charcoal} />

      {/* Screen Render Orchrastrator */}
      {currentScreen === 'splash' && (
        <View style={styles.splashContainer}>
          <Text style={styles.splashLogo}>SHOPEZ</Text>
          <Text style={styles.splashSub}>PREMIUM COUTURE</Text>
          <TouchableOpacity style={styles.splashButton} onPress={() => setCurrentScreen('onboarding')}>
            <Text style={styles.splashBtnText}>ENTER EXPERIENCE</Text>
          </TouchableOpacity>
        </View>
      )}

      {currentScreen === 'onboarding' && (
        <View style={styles.screenFull}>
          <Image 
            source={{ uri: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=600&q=80' }} 
            style={styles.onboardBg} 
          />
          <View style={styles.onboardOverlay}>
            <Text style={styles.onboardTitle}>ELEVATE YOUR STYLE</Text>
            <Text style={styles.onboardDesc}>Curated wardrobes, premium cashmere wools, loopback fleece garments, and active knit sneakers.</Text>
            <TouchableOpacity style={styles.btnGold} onPress={() => setCurrentScreen('auth')}>
              <Text style={styles.btnTextDark}>GET STARTED</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {currentScreen === 'auth' && (
        <ScrollView contentContainerStyle={styles.scrollAuth}>
          <Text style={styles.authTitle}>ACCESS GATEWAY</Text>
          <Text style={styles.authDesc}>Sign in to sync your wishlist, track delivery timelines, and access priority sizing.</Text>

          <View style={styles.formGroup}>
            <Text style={styles.label}>EMAIL ADDRESS</Text>
            <TextInput style={styles.input} placeholder="user@shopez.com" placeholderTextColor={COLORS.gray} />
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>PASSWORD</Text>
            <TextInput style={styles.input} secureTextEntry placeholder="••••••••" placeholderTextColor={COLORS.gray} />
          </View>

          <TouchableOpacity style={styles.btnDark} onPress={() => setCurrentScreen('home')}>
            <Text style={styles.btnTextWhite}>SECURE SIGN IN</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => setCurrentScreen('home')} style={styles.skipButton}>
            <Text style={styles.skipText}>GUEST BROWSE</Text>
          </TouchableOpacity>
        </ScrollView>
      )}

      {currentScreen === 'home' && (
        <View style={styles.screenFlex}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.logo}>SHOPEZ</Text>
            <TouchableOpacity onPress={() => setCurrentScreen('cart')}>
              <Text style={styles.cartIcon}>🛒 (2)</Text>
            </TouchableOpacity>
          </View>

          {/* Catalog */}
          <ScrollView style={styles.homeScroll}>
            <Text style={styles.sectionTitle}>TRENDING ARRIVALS</Text>
            
            <View style={styles.productsGrid}>
              {/* Product 1 */}
              <TouchableOpacity style={styles.productCard} onPress={() => setCurrentScreen('details')}>
                <Image source={{ uri: activeProduct.image }} style={styles.prodImg} />
                <Text style={styles.prodBrand}>{activeProduct.brand}</Text>
                <Text style={styles.prodName}>{activeProduct.name}</Text>
                <Text style={styles.prodPrice}>{activeProduct.price}</Text>
              </TouchableOpacity>

              {/* Product 2 */}
              <TouchableOpacity style={styles.productCard} onPress={() => setCurrentScreen('details')}>
                <Image source={{ uri: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=600&q=80' }} style={styles.prodImg} />
                <Text style={styles.prodBrand}>Nike</Text>
                <Text style={styles.prodName}>Knit Sneakers</Text>
                <Text style={styles.prodPrice}>$135.00</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>

          {/* Footer Tabs */}
          <View style={styles.tabBar}>
            <TouchableOpacity style={styles.tabBtn} onPress={() => setCurrentScreen('home')}>
              <Text style={[styles.tabText, { color: COLORS.gold }]}>Shop</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.tabBtn} onPress={() => setCurrentScreen('cart')}>
              <Text style={styles.tabText}>Cart</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.tabBtn} onPress={() => setCurrentScreen('profile')}>
              <Text style={styles.tabText}>Profile</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {currentScreen === 'details' && (
        <View style={styles.screenFlex}>
          <View style={styles.header}>
            <TouchableOpacity onPress={() => setCurrentScreen('home')}>
              <Text style={styles.backText}>← BACK</Text>
            </TouchableOpacity>
            <Text style={styles.titleCenter}>{activeProduct.name.toUpperCase()}</Text>
          </View>

          <ScrollView style={styles.detailScroll}>
            <Image source={{ uri: activeProduct.image }} style={styles.detailImg} />
            
            <View style={styles.detailMeta}>
              <Text style={styles.detailBrand}>{activeProduct.brand.toUpperCase()}</Text>
              <Text style={styles.detailPrice}>{activeProduct.price}</Text>
              <Text style={styles.detailDesc}>{activeProduct.description}</Text>

              {/* Sizes */}
              <Text style={styles.optionLabel}>SELECT SIZE</Text>
              <View style={styles.optionsRow}>
                {activeProduct.sizes.map(size => (
                  <TouchableOpacity 
                    key={size} 
                    style={[styles.optionChip, selectedSize === size && styles.optionChipActive]}
                    onPress={() => setSelectedSize(size)}
                  >
                    <Text style={[styles.optionText, selectedSize === size && styles.optionTextActive]}>{size}</Text>
                  </TouchableOpacity>
                ))}
              </View>

              {/* Colors */}
              <Text style={styles.optionLabel}>SELECT COLOR</Text>
              <View style={styles.optionsRow}>
                {activeProduct.colors.map(color => (
                  <TouchableOpacity 
                    key={color} 
                    style={[styles.optionChip, selectedColor === color && styles.optionChipActive]}
                    onPress={() => setSelectedColor(color)}
                  >
                    <Text style={[styles.optionText, selectedColor === color && styles.optionTextActive]}>{color}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </ScrollView>

          <View style={styles.bottomBar}>
            <TouchableOpacity style={styles.btnDark} onPress={() => setCurrentScreen('cart')}>
              <Text style={styles.btnTextWhite}>ADD TO BAG</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {currentScreen === 'cart' && (
        <View style={styles.screenFlex}>
          <View style={styles.header}>
            <TouchableOpacity onPress={() => setCurrentScreen('home')}>
              <Text style={styles.backText}>← SHOP</Text>
            </TouchableOpacity>
            <Text style={styles.titleCenter}>BAG</Text>
          </View>

          <ScrollView style={styles.cartScroll}>
            {/* Cart Item */}
            <View style={styles.cartItem}>
              <Image source={{ uri: activeProduct.image }} style={styles.cartItemImg} />
              <View style={styles.cartItemDetails}>
                <Text style={styles.cartItemName}>{activeProduct.name}</Text>
                <Text style={styles.cartItemMeta}>Size: {selectedSize} | Color: {selectedColor}</Text>
                <Text style={styles.cartItemPrice}>{activeProduct.price}</Text>
              </View>
            </View>

            {/* Calculations */}
            <View style={styles.breakdown}>
              <View style={styles.breakdownRow}><Text style={styles.bText}>Subtotal</Text><Text style={styles.bVal}>$249.00</Text></View>
              <View style={styles.breakdownRow}><Text style={styles.bText}>Luxury Tax (18%)</Text><Text style={styles.bVal}>$44.82</Text></View>
              <View style={styles.breakdownRow}><Text style={styles.bText}>Shipping</Text><Text style={styles.bVal}>FREE</Text></View>
              <View style={[styles.breakdownRow, styles.bTotalRow]}><Text style={styles.bTotal}>Grand Total</Text><Text style={styles.bTotalVal}>$293.82</Text></View>
            </View>
          </ScrollView>

          <View style={styles.bottomBar}>
            <TouchableOpacity style={styles.btnGold} onPress={() => setCurrentScreen('checkout')}>
              <Text style={styles.btnTextDark}>PROCEED TO CHECKOUT</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {currentScreen === 'checkout' && (
        <View style={styles.screenFlex}>
          <View style={styles.header}>
            <TouchableOpacity onPress={() => setCurrentScreen('cart')}>
              <Text style={styles.backText}>← BAG</Text>
            </TouchableOpacity>
            <Text style={styles.titleCenter}>CHECKOUT</Text>
          </View>

          <ScrollView contentContainerStyle={styles.checkoutForm}>
            <Text style={styles.sectionTitle}>SHIPPING ADDRESS</Text>
            <TextInput style={styles.inputField} placeholder="Street Address" placeholderTextColor={COLORS.gray} />
            <TextInput style={styles.inputField} placeholder="City" placeholderTextColor={COLORS.gray} />
            <View style={styles.inputRow}>
              <TextInput style={[styles.inputField, { flex: 1, marginRight: 8 }]} placeholder="Zip Code" placeholderTextColor={COLORS.gray} />
              <TextInput style={[styles.inputField, { flex: 1 }]} placeholder="Country" placeholderTextColor={COLORS.gray} />
            </View>

            <Text style={[styles.sectionTitle, { marginTop: 20 }]}>PAYMENT METHOD</Text>
            <View style={styles.paymentSelector}>
              <Text style={styles.paymentSelected}>💳 Credit / Debit Card (Stripe)</Text>
            </View>
          </ScrollView>

          <View style={styles.bottomBar}>
            <TouchableOpacity style={styles.btnDark} onPress={() => { alert('Order Placed Successfully!'); setCurrentScreen('profile'); }}>
              <Text style={styles.btnTextWhite}>PLACE SECURE ORDER</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {currentScreen === 'profile' && (
        <View style={styles.screenFlex}>
          <View style={styles.header}>
            <Text style={styles.logo}>SHOPEZ</Text>
            <TouchableOpacity onPress={() => setCurrentScreen('splash')}>
              <Text style={styles.logoutText}>LOGOUT</Text>
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.profileScroll}>
            {/* User Bio */}
            <View style={styles.bio}>
              <Text style={styles.bioName}>JANE DOE</Text>
              <Text style={styles.bioEmail}>user@shopez.com</Text>
            </View>

            {/* Timelines */}
            <Text style={styles.sectionTitle}>ACTIVE ORDER TIMELINE</Text>
            <View style={styles.timeline}>
              <View style={styles.timelineItem}><Text style={styles.timelineDotActive}>✓</Text><Text style={styles.timelineTextActive}>Order Placed (Pending)</Text></View>
              <View style={styles.timelineItem}><Text style={styles.timelineDot}>2</Text><Text style={styles.timelineText}>Packed & Inspected</Text></View>
              <View style={styles.timelineItem}><Text style={styles.timelineDot}>3</Text><Text style={styles.timelineText}>Shipped out</Text></View>
              <View style={styles.timelineItem}><Text style={styles.timelineDot}>4</Text><Text style={styles.timelineText}>Delivered</Text></View>
            </View>
          </ScrollView>

          {/* Footer Tabs */}
          <View style={styles.tabBar}>
            <TouchableOpacity style={styles.tabBtn} onPress={() => setCurrentScreen('home')}>
              <Text style={styles.tabText}>Shop</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.tabBtn} onPress={() => setCurrentScreen('cart')}>
              <Text style={styles.tabText}>Cart</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.tabBtn} onPress={() => setCurrentScreen('profile')}>
              <Text style={[styles.tabText, { color: COLORS.gold }]}>Profile</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.charcoal,
  },
  splashContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  splashLogo: {
    fontSize: 48,
    color: COLORS.white,
    fontFamily: 'Georgia',
    fontWeight: 'bold',
    letterSpacing: 8,
  },
  splashSub: {
    fontSize: 10,
    color: COLORS.gold,
    letterSpacing: 4,
    marginTop: 8,
    fontWeight: '600',
  },
  splashButton: {
    marginTop: 48,
    borderWidth: 1,
    borderColor: COLORS.gold,
    paddingHorizontal: 24,
    paddingVertical: 12,
  },
  splashBtnText: {
    color: COLORS.gold,
    fontSize: 11,
    fontWeight: 'bold',
    letterSpacing: 2,
  },
  screenFull: {
    flex: 1,
  },
  screenFlex: {
    flex: 1,
    backgroundColor: COLORS.cream,
  },
  onboardBg: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    opacity: 0.8,
  },
  onboardOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
    padding: 32,
    paddingBottom: 64,
  },
  onboardTitle: {
    fontSize: 32,
    color: COLORS.white,
    fontFamily: 'Georgia',
    fontWeight: 'bold',
    marginBottom: 16,
  },
  onboardDesc: {
    fontSize: 14,
    color: COLORS.neutral,
    lineHeight: 22,
    marginBottom: 32,
    fontWeight: '300',
  },
  scrollAuth: {
    padding: 24,
    paddingTop: 80,
  },
  authTitle: {
    fontSize: 28,
    color: COLORS.white,
    fontFamily: 'Georgia',
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 8,
  },
  authDesc: {
    fontSize: 12,
    color: COLORS.gray,
    textAlign: 'center',
    lineHeight: 18,
    marginBottom: 40,
  },
  formGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 9,
    color: COLORS.gold,
    fontWeight: 'bold',
    letterSpacing: 2,
    marginBottom: 6,
  },
  input: {
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    color: COLORS.white,
    padding: 14,
    fontSize: 13,
  },
  btnDark: {
    backgroundColor: COLORS.charcoal,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnTextWhite: {
    color: COLORS.white,
    fontSize: 11,
    fontWeight: 'bold',
    letterSpacing: 2,
  },
  btnGold: {
    backgroundColor: COLORS.gold,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnTextDark: {
    color: COLORS.charcoal,
    fontSize: 11,
    fontWeight: 'bold',
    letterSpacing: 2,
  },
  skipButton: {
    marginTop: 20,
    alignItems: 'center',
  },
  skipText: {
    color: COLORS.gray,
    fontSize: 11,
    letterSpacing: 1,
  },
  header: {
    height: 60,
    backgroundColor: COLORS.charcoal,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'between',
    paddingHorizontal: 20,
  },
  logo: {
    fontSize: 20,
    color: COLORS.white,
    fontFamily: 'Georgia',
    fontWeight: 'bold',
    letterSpacing: 4,
  },
  cartIcon: {
    color: COLORS.white,
    fontSize: 14,
  },
  homeScroll: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 11,
    color: COLORS.gray,
    fontWeight: 'bold',
    letterSpacing: 2,
    marginBottom: 16,
  },
  productsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  productCard: {
    width: '48%',
    marginBottom: 20,
  },
  prodImg: {
    width: '100%',
    height: 200,
    backgroundColor: COLORS.neutral,
  },
  prodBrand: {
    fontSize: 8,
    color: COLORS.gray,
    fontWeight: 'bold',
    marginTop: 8,
    letterSpacing: 1,
  },
  prodName: {
    fontSize: 11,
    color: COLORS.charcoal,
    fontWeight: '600',
    marginTop: 2,
  },
  prodPrice: {
    fontSize: 12,
    color: COLORS.gold,
    fontWeight: 'bold',
    marginTop: 2,
  },
  tabBar: {
    height: 60,
    backgroundColor: COLORS.charcoal,
    borderTopWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
    flexDirection: 'row',
  },
  tabBtn: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabText: {
    color: COLORS.gray,
    fontSize: 11,
    fontWeight: '600',
    letterSpacing: 1,
  },
  backText: {
    color: COLORS.gold,
    fontSize: 11,
    fontWeight: 'bold',
  },
  titleCenter: {
    color: COLORS.white,
    fontSize: 12,
    fontWeight: 'bold',
    letterSpacing: 2,
  },
  detailScroll: {
    flex: 1,
  },
  detailImg: {
    width: width,
    height: 450,
  },
  detailMeta: {
    padding: 20,
  },
  detailBrand: {
    fontSize: 10,
    color: COLORS.gray,
    fontWeight: 'bold',
    letterSpacing: 2,
  },
  detailPrice: {
    fontSize: 22,
    color: COLORS.gold,
    fontWeight: 'bold',
    marginTop: 6,
  },
  detailDesc: {
    fontSize: 12,
    color: COLORS.gray,
    lineHeight: 18,
    marginTop: 12,
    fontWeight: '300',
  },
  optionLabel: {
    fontSize: 9,
    color: COLORS.charcoal,
    fontWeight: 'bold',
    letterSpacing: 1.5,
    marginTop: 20,
    marginBottom: 8,
  },
  optionsRow: {
    flexDirection: 'row',
    gap: 8,
  },
  optionChip: {
    borderWidth: 1,
    borderColor: COLORS.neutral,
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: COLORS.white,
  },
  optionChipActive: {
    borderColor: COLORS.gold,
    backgroundColor: 'rgba(197, 168, 128, 0.05)',
  },
  optionText: {
    fontSize: 11,
    color: COLORS.charcoal,
  },
  optionTextActive: {
    color: COLORS.gold,
    fontWeight: 'bold',
  },
  bottomBar: {
    padding: 16,
    backgroundColor: COLORS.white,
    borderTopWidth: 1,
    borderColor: COLORS.neutral,
  },
  cartScroll: {
    padding: 16,
  },
  cartItem: {
    flexDirection: 'row',
    backgroundColor: COLORS.white,
    padding: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: COLORS.neutral,
  },
  cartItemImg: {
    width: 80,
    height: 100,
  },
  cartItemDetails: {
    flex: 1,
    marginLeft: 16,
    justifyContent: 'space-between',
  },
  cartItemName: {
    fontSize: 13,
    fontWeight: 'bold',
    color: COLORS.charcoal,
  },
  cartItemMeta: {
    fontSize: 10,
    color: COLORS.gray,
  },
  cartItemPrice: {
    fontSize: 12,
    color: COLORS.gold,
    fontWeight: 'bold',
  },
  breakdown: {
    backgroundColor: COLORS.white,
    padding: 16,
    borderWidth: 1,
    borderColor: COLORS.neutral,
    marginTop: 20,
  },
  breakdownRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  bText: {
    fontSize: 12,
    color: COLORS.gray,
  },
  bVal: {
    fontSize: 12,
    color: COLORS.charcoal,
    fontWeight: '600',
  },
  bTotalRow: {
    borderTopWidth: 1,
    borderColor: COLORS.neutral,
    paddingTop: 10,
    marginBottom: 0,
  },
  bTotal: {
    fontSize: 13,
    fontWeight: 'bold',
    color: COLORS.charcoal,
  },
  bTotalVal: {
    fontSize: 14,
    color: COLORS.gold,
    fontWeight: 'bold',
  },
  checkoutForm: {
    padding: 16,
  },
  inputField: {
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.neutral,
    padding: 12,
    fontSize: 12,
    color: COLORS.charcoal,
    marginBottom: 12,
  },
  inputRow: {
    flexDirection: 'row',
  },
  paymentSelector: {
    borderWidth: 1,
    borderColor: COLORS.gold,
    backgroundColor: 'rgba(197, 168, 128, 0.05)',
    padding: 16,
    alignItems: 'center',
  },
  paymentSelected: {
    color: COLORS.gold,
    fontSize: 11,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  profileScroll: {
    padding: 16,
  },
  bio: {
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.neutral,
    padding: 20,
    marginBottom: 24,
  },
  bioName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.charcoal,
    letterSpacing: 1,
  },
  bioEmail: {
    fontSize: 12,
    color: COLORS.gray,
    marginTop: 2,
  },
  logoutText: {
    color: COLORS.gold,
    fontSize: 10,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  timeline: {
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.neutral,
    padding: 20,
  },
  timelineItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  timelineDotActive: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: COLORS.gold,
    color: COLORS.charcoal,
    textAlign: 'center',
    lineHeight: 24,
    fontSize: 12,
    fontWeight: 'bold',
    marginRight: 16,
  },
  timelineTextActive: {
    fontSize: 12,
    color: COLORS.charcoal,
    fontWeight: 'bold',
  },
  timelineDot: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: COLORS.neutral,
    color: COLORS.gray,
    textAlign: 'center',
    lineHeight: 24,
    fontSize: 11,
    marginRight: 16,
  },
  timelineText: {
    fontSize: 11,
    color: COLORS.gray,
  },
});
