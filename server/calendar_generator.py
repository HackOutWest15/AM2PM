from icalendar import Calendar, Event, vText
from datetime import datetime
import pytz

def create_schedule(artists):

	cal = Calendar()

	cal.add('prodid', '-//pm2am//Wild Out West//')
	cal.add('version', '2.0')

	timezone = pytz.timezone('Europe/Stockholm')

	# Add all selected gigs
	for artist in artists:
		event = Event()
		event.add('summary', artist['name'])

		start_datetime = datetime.strptime(artist['start_date']+artist['start_time'], '%Y-%m-%d%H:%M').replace(tzinfo=timezone)
		event.add('dtstart', start_datetime)
		end_datetime = datetime.strptime(artist['end_date']+artist['end_time'], '%Y-%m-%d%H:%M').replace(tzinfo=timezone)
		event.add('dtend', end_datetime)

		event['location'] = vText(artist['venue'])
		cal.add_component(event)

	return cal

def save_schedule(artists, path):

	with open(path, 'w') as f:
		f.write(create_schedule(artists).to_ical())

def test_save_schedule():

	artists = [{"name": "Beck", "start_date": "2015-08-13", "start_time": "21:20", "end_date": "2015-08-13", "end_time": "22:55", "venue": "Flamingo"}]
	path = './test.ics'
	save_schedule(artists, path)