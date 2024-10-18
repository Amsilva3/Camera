import { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  Image,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import * as MediaLibrary from "expo-media-library";

export default function App() {
  const [photo, setPhoto] = useState(null);

  const openAlbum = async () => {
    const options = {
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      // allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    };

    let response = await ImagePicker.launchImageLibraryAsync(options);

    console.log(response);

    if (!response.canceled) {
      setPhoto(response.assets[0].uri);
    }
  };

  async function openCamera() {
    const options = {
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    };

    const response = await ImagePicker.launchCameraAsync(options);

    setPhoto(response.assets[0].uri);
    //salvar as fotos na galeria
    savePhotoToGallery(response.assets[0].uri);
  }
  // função para salvar as fotos na galeria, mas primeiro tem que instalar "expo-media-library"; e colocar plugins no app.json ,para depis criar a função.
  async function savePhotoToGallery(uri) {
    try {
      // Solicitar permissão para acessar a galeria
      const { status } = await MediaLibrary.requestPermissionsAsync();
      if (status !== "granted") {
        console.error("Permissão para acessar a galeria negada");
        return;
      }

      // Salvar a foto na galeria
      const asset = await MediaLibrary.createAssetAsync(uri);
      await MediaLibrary.createAlbumAsync("Expo Photos", asset, false);

      console.log("Foto salva na galeria:", asset.uri);
    } catch (e) {
      console.error("Erro ao salvar a foto na galeria:", e);
    }
  }
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.buttons}>
        <TouchableOpacity style={styles.button} onPress={openAlbum}>
          <Text style={styles.text}>Abrir album</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button} onPress={openCamera}>
          <Text style={styles.text}>Abrir camera</Text>
        </TouchableOpacity>
      </View>

      {photo !== null && <Image source={{ uri: photo }} style={styles.image} />}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
  },
  buttons: {
    marginTop: 44,
    flexDirection: "row",
    gap: 14,
    marginBottom: 15,
  },
  button: {
    backgroundColor: "#121212",
    padding: 4,
    paddingLeft: 16,
    paddingRight: 16,
    borderRadius: 4,
  },
  text: {
    color: "#FFF",
  },
  image: {
    width: "100%",
    height: "85%",
    objectFit: "cover",
    marginBottom: 20,
  },
});
