/// Delivery address entity matching Google Stitch checkout and address selection.
class DeliveryAddress {
  const DeliveryAddress({
    required this.id,
    required this.recipientName,
    required this.phone,
    required this.addressLine,
    required this.city,
    required this.state,
    required this.pincode,
    this.tag = 'Home',
    this.isDefault = false,
  });

  final String id;
  final String recipientName;
  final String phone;
  final String addressLine;
  final String city;
  final String state;
  final String pincode;
  final String tag;
  final bool isDefault;

  String get formattedAddress => '$addressLine, $city, $state $pincode';
  String get shortLocation => '$city, $state';
}
