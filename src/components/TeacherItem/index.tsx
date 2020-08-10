import React, { useState } from 'react';
import { View, Image, Text, Linking, AsyncStorage } from 'react-native';
import { RectButton } from 'react-native-gesture-handler';

import styles from './styles';

import heartOutlineIcone from  '../../assets/images/icons/heart-outline.png'
import unfavoriteIcon from '../../assets/images/icons/unfavorite.png'
import whatsappIcon from '../../assets/images/icons/whatsapp.png'
import api from '../../services/api';


export interface Teacher {
  id: number
  subject:string
  cost: number,
  name: string,
  avatar:string,
  whatsapp: string,
  bio: string
} 

export interface TeacherItemProps {
  teacher: Teacher,
  favorited: boolean
}

const TeacherItem: React.FC<TeacherItemProps> = ({ teacher, favorited }) => {
  const [isFavorited, setIsFavorited] = useState(favorited);

  function newConnection() {
    api.post('connections', {
      user_id: teacher.id
    })
  }

  function handleLinkToWhatsapp() {
    newConnection();

    Linking.openURL(`whatsapp://send?phone=${teacher.whatsapp}`)
  }

  async function handleToggleFavorites() {
    const favorites = await AsyncStorage.getItem('favorites')
    
    let favoritedArray: Teacher[] = []

    if (favorites) {
      favoritedArray = JSON.parse(favorites)
    }

    if (isFavorited) {
      console.log('favorited')
      const favoriteIndex = favoritedArray.findIndex((favorite) => favorite.id === teacher.id)

      favoritedArray.splice(favoriteIndex, 1)

      setIsFavorited(false)
    } else {
      favoritedArray.push(teacher)

      favorited = false
      setIsFavorited(true)
    }
    
    await AsyncStorage.setItem('favorites', JSON.stringify(favoritedArray))
  }

  return (
    <View style={styles.container}>
      <View style={styles.profile}>
        <Image 
          style={styles.avatar}
          source={{
            uri: teacher.avatar
          }}
        />

        <View style={styles.profileInfo}>
          <Text style={styles.name}>{teacher.name}</Text>
        <Text style={styles.subject}>{teacher.subject}</Text>
        </View>
      </View>

      <Text style={styles.bio}>{teacher.bio}</Text>

      <View style={styles.footer}>
        <Text style={ styles.price}>
          Preço/hora {'  '}
        <Text style={styles.priceValue}>R$ {teacher.cost}</Text>
        </Text>

        <View style={styles.buttonsContainer}>
          <RectButton 
            style={[styles.favoriteButton, !favorited ? styles.favorited : null]}
            onPress={handleToggleFavorites}
          >
            {
              isFavorited ?
              <Image source={heartOutlineIcone} /> :
              <Image source={unfavoriteIcon} />
            }
          </RectButton>

          <RectButton style={styles.contactButton} onPress={handleLinkToWhatsapp}>
            <Image source={whatsappIcon} />
            <Text style={styles.contactButtonText}>Entrar em contato</Text>
          </RectButton>
        </View>
      </View>
    </View>
  )
}

export default TeacherItem;