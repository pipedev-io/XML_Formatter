from flask import Flask, request, jsonify, send_from_directory
from defusedxml.ElementTree import fromstring as safe_fromstring, ParseError as SafeParseError
from xml.dom import minidom
from defusedxml import minidom as safe_minidom
from flask_cors import CORS, cross_origin

app = Flask(__name__)
app.config['MAX_CONTENT_LENGTH'] = 2 * 1024 * 1024  # 2 MiB
cors = CORS(app)  # allow CORS for all domains on all routes.
app.config['CORS_HEADERS'] = 'Content-Type'

# Serve the main HTML file
@app.route('/')
def index():
    return send_from_directory('.', 'index.html')

# Serve static files (CSS, JS, etc.)
@app.route('/styles/<path:filename>')
def styles(filename):
    return send_from_directory('styles', filename)

# Serve JS files
@app.route('/<filename>.js')
def js_files(filename):
    return send_from_directory('.', f'{filename}.js')

@app.route('/images/<filename>')
def images(filename):
    return send_from_directory('images', filename)

@app.route('/format', methods=['POST'])
@cross_origin()
def format_xml():
    try:
        data = request.json
        xml_input = data.get('xmlInput')
        dom = safe_minidom.parseString(xml_input)
        formatted = dom.toprettyxml(indent="  ")
        return jsonify({
            'formatted': formatted,
            'success': True
        })
    except Exception as e:
        return jsonify({
            'error': 'Invalid XML format',
            'success': False
        })

if __name__ == '__main__':
    import os
    port = int(os.environ.get('PORT', 8080))
    app.run(host='0.0.0.0', port=port)