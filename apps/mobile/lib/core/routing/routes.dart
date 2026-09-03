class AppRoutes {
  static const home = '/';
  static const auth = '/auth';
  static const welcome = '/welcome';
  static const login = '/auth/login';
  static const register = '/auth/register';
  static const otpVerify = '/auth/verify-otp';
  static const languageSelect = '/auth/language-select';
  static const roleSelect = '/auth/role-select';

  static const splash = '/splash';
  static const onboarding = '/onboarding';
  static const locationSetup = '/onboarding/location';
  static const profileSetup = '/onboarding/profile';

  static const categories = '/categories';
  static const products = '/products';
  static const productDetails = '/products/:id';
  static const reviews = '/products/:id/reviews';
  static const recentlyViewed = '/recently-viewed';

  static const search = '/search';
  static const searchResults = '/search/results';

  static const cartCheckout = '/cart';
  static const checkout = '/checkout';
  static const payment = '/checkout/payment';
  static const orderConfirmed = '/checkout/confirmed';

  static const addresses = '/addresses';
  static const selectAddress = '/addresses/select';
  static const addAddress = '/addresses/add';

  static const orders = '/orders';
  static const orderDetails = '/orders/:id';
  static const orderTracking = '/orders/:id/track';

  static const wishlist = '/wishlist';
  static const recommendations = '/recommendations';
  static const weather = '/weather';
  static const mandiPrices = '/mandi-prices';
  static const cropPriceDetail = '/mandi-prices/:id';

  static const notifications = '/notifications';
  static const notificationSettings = '/notifications/settings';

  static const forum = '/forum';
  static const community = '/community';

  static const profile = '/profile';
  static const editProfile = '/profile/edit';
  static const settings = '/settings';
  static const support = '/support';
  static const about = '/about';

  static const seller = '/seller';
  static const admin = '/admin';

  // Stage 2 — design system showcase (remove before production)
  static const designSystemPreview = '/design-system-preview';
}
