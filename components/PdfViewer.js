import React from 'react';
import { StyleSheet, View } from 'react-native';
import { WebView } from 'react-native-webview';
import { url } from '../utils/utils';

const PdfViewer = ({ link }) => {
  const pdfUrl = `${url.BASE_URL}/pdfViewer.html?pdfUrl=${url.BASE_URL}/${link}`; 

  console.log('PDF URL:', pdfUrl);

  return (
    <View style={styles.container}>
    {/* <WebView 
        originWhitelist={['*']}
        source={{ uri: pdfUrl  }} 
        style={styles.webView} 
      /> */}
      <WebView 
        source={{
          html: `
            <html>
              <body style="margin:0;padding:0;">
                <iframe 
                  width="100%" 
                  height="100%" 
                  src="${pdfUrl}" 
                  frameborder="0" 
                  allowfullscreen>
                </iframe>
              </body>
            </html>
          `,
        }}
        style={styles.webView} 
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    // flex:1,
    height:500
  },
  webView: {
    // flex: 1,
  },
});

export default PdfViewer;
