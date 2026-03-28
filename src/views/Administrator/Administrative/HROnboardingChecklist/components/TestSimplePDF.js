import React from "react";
import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";

const styles = StyleSheet.create({
  page: {
    padding: 30,
    backgroundColor: "white",
  },
  text: {
    fontSize: 20,
    marginBottom: 10,
  },
});

const TestSimplePDF = () => {
  console.log("TestSimplePDF rendering");
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View>
          <Text style={styles.text}>Test PDF Document</Text>
          <Text>If you can see this, PDFViewer is working!</Text>
        </View>
      </Page>
    </Document>
  );
};

export default TestSimplePDF;
