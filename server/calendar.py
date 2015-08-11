from icalendar import Calendar, Event, vText
from datetime import datetime
import pytz

def create_schedule(artists):

	cal = Calendar()

	cal.add('prodid', '-//pm2am//Wild Out West//')
	cal.add('version', '2.0')

	timezone = pytz.timzone('Europe/Stockholm')

	# Add all selected gigs
	# {"name": "Av Av Av", "date": "2015-08-14", "start_time": "17:15", "end_time": "18:30", "venue": "Flamingo"}
	for artist in artists:
		event = Event()
		event.add('summary', artist['name'])

		start_datetime = datetime.strptime(artist['date']+artist['start_time'], '%Y-%m-%d%H:%M').replace(tzinfo=timzone)
		event.add('dtstart', start_date)
		end_datetime = datetime.strptime(artist['date']+artist['end_time'], '%Y-%m-%d%H:%M').replace(tzinfo=timzone)
		event.add('dtend', end_datetime)

		event['location'] = vText(artist['venue'])
		cal.add_component(event)

	return cal

with open('test.ics', 'w') as f:
	artists = [{"name": "Av Av Av", "date": "2015-08-14", "start_time": "17:15", "end_time": "18:30", "venue": "Flamingo"}]
	f.write(create_schedule(artists).to_ical())