# models.py
from django.db import models
from django.contrib.auth.models import User

class Product(models.Model):
	name = models.CharField(max_length=200)
	price = models.FloatField(null=False)
	image = models.ImageField(null=True, blank=True)
	
	category_choices = [
        ('body', 'Body'),
        ('face', 'Face'),
        ('lips', 'Lips'),
    ]
	category = models.CharField(max_length=20, choices=category_choices,default="body")
	description = models.TextField(default="Get a whole new experience with the best product you could have.")
	for_choices = [
		('oily','Oily'),
		('dry','Dry'),
		('mixed','Mixed'),
		('sensitive',"Sensitive"),
		('normal','Normal'),
	]
	for_type = models.CharField(max_length=10,choices=for_choices,default="normal")
	warranty_choices = [
		('none','None'),
		('seller','Seller'),
		('brand','Brand'),
	]
	warranty = models.CharField(max_length=20, choices=warranty_choices,default="none")
	brand_choices = [
		('nivea','Nivea'),
		('loreal','Loreal'),
		('dove','Dove'),
		('olay','Olay'),
		('clinique','Clinique'),
		('himalaya','Himalaya'),
		('bareanatomy','Bareanatomy'),
		('cetaphil','Cetaphil'),
		('aveeno','Aveeno'),
		('cerave','Cerave'),
	]
	brand = models.CharField(max_length=20, choices=brand_choices,default="none")


	def __str__(self):
		return self.name

	@property
	def imageURL(self):
		try:
			url = self.image.url
		except:
			url = ''
		return url

class Customer(models.Model):
	user = models.OneToOneField(User, null=True, blank=True, on_delete=models.CASCADE)
	name = models.CharField(max_length=200, null=True)
	email = models.CharField(max_length=200)

	def __str__(self):
		return self.name


class Order(models.Model):
	customer = models.ForeignKey(Customer, on_delete=models.SET_NULL, null=True, blank=True)
	date_ordered = models.DateTimeField(auto_now_add=True)
	complete = models.BooleanField(default=False)
	transaction_id = models.CharField(max_length=100, null=True)

	def __str__(self):
		return str(self.id)

	@property
	def get_cart_total(self):
		orderitems = self.orderitem_set.all()
		total = sum([item.get_total for item in orderitems])
		return total 

	@property
	def get_cart_items(self):
		orderitems = self.orderitem_set.all()
		total = sum([item.quantity for item in orderitems])
		return total 

class OrderItem(models.Model):
	product = models.ForeignKey(Product, on_delete=models.SET_NULL, null=True)
	order = models.ForeignKey(Order, on_delete=models.CASCADE, null=True)
	quantity = models.IntegerField(default=0, null=True, blank=True)
	date_added = models.DateTimeField(auto_now_add=True)

	@property
	def get_total(self):
		total = self.product.price * self.quantity
		return total

	

class ShippingAddress(models.Model):
	customer = models.ForeignKey(Customer, on_delete=models.SET_NULL, null=True)
	order = models.ForeignKey(Order, on_delete=models.SET_NULL, null=True)
	address = models.CharField(max_length=200, null=False)
	city = models.CharField(max_length=200, null=False)
	state = models.CharField(max_length=200, null=False)
	ward = models.CharField(max_length=200, null=False)
	street = models.CharField(max_length=200, null=False)
	date_added = models.DateTimeField(auto_now_add=True)

	def __str__(self):
		return self.address

class ConfirmedOrder(models.Model):
    customer = models.ForeignKey(Customer, on_delete=models.CASCADE)
    order_number = models.CharField(max_length=100, unique=True, null=True)
    total_amount = models.FloatField()
    payment_method = models.CharField(max_length=20, default="COD")
    status = models.CharField(max_length=20, default="Pending")
    date_confirmed = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Confirmed Order {self.id} - {self.customer.name}"

class ConfirmedOrderItem(models.Model):
    confirmed_order = models.ForeignKey(ConfirmedOrder, on_delete=models.CASCADE, related_name='items')
    product_name = models.CharField(max_length=200) # Store name as string in case product is deleted
    price_at_purchase = models.FloatField() # Lock the price!
    quantity = models.IntegerField()

    @property
    def get_total(self):
        return self.price_at_purchase * self.quantity
	